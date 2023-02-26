import { setItem, getItem, toBool } from "@/utils/storage";
import { Howl, Howler } from 'howler';
import { useSettingsStore } from "@/store/modules/settings";
import BattlePlay from "@/assets/music/battle-tick.mp3"

import BattleGotItem from "@/assets/music/battle-got-item.mp3"
import BattleTotalCount from "@/assets/music/battle-total-count.mp3"
import BattleSelectWinner from "@/assets/music/battle-select-winner.mp3"
import BattleToggle from "@/assets/music/battle-roll-under.mp3"
const volume = getItem('soundLevel');
const soundEnabled = toBool(getItem('caseMusicEnabled'), true);

/**訪問控制 */
export const useMusicStore = defineStore("music", {
  state: () => ({
    groups: {},
    library: {},
    isUnlocked: false,
    soundEnabled: soundEnabled,
    volume: volume ? parseFloat(volume) : 0.75,
  }),
  getters: {
    getGroups: (state) => state.groups,
    getLibrary: (state) => state.library,
    getIsUnlocked: (state) => state.isUnlocked,
    getSoundEnabled: (state) => state.soundEnabled,
    getVolume: (state) => state.volume,
  },
  actions: {
    setSoundEnabledState(value) {
      this.soundEnabled = !!value;
      setItem('caseMusicEnabled', !!value);
    },
    setVolumeLevel(value) {
      value = parseFloat(value);
      value = value > 1 ? .75 : value;
      this.volume = value;
      Howler.volume(value);
      setItem('soundLevel', value);
    },

    addSoundsToLibrary(sounds) {
      for (const sound of sounds) {
        if (!this.library[sound.alias]) {
          this.library[sound.alias] = new Howl({
            src: sound.src,
            preload: sound.preload,
            loop: sound.loop ?? false,
            onunlock: () => {
              this.isUnlocked = true;
            },
          });
          if (sound.group) {
            let group = this.groups[sound.group];
            if (!group) {
              group = this.groups[sound.group] = {
                currentAlias: null,
                soundsAliases: [],
              };
            }
            group.soundsAliases.push(sound.alias);
          }
        }
      }
      Howler.volume(this.volume);
      Howler.mute(!this.soundEnabled);
    },
    preloadRandomSoundFromGroup(group) {
      const len = this.groups[group].soundsAliases.length;
      let rand = Math.floor(Math.random() * len) + 1,
        alias = this.groups[group].soundsAliases[rand - 1];
      alias === this.groups[group].currentAlias &&
        (rand = rand === len ? 1 : rand + 1, alias = this.groups[group].soundsAliases[rand - 1]),
        this.groups[group].currentAlias = alias,
        this.library[alias].load();

    },
    playCurrentRandomFromGroup(group) {
      const alias = this.groups[group].currentAlias;
      if (alias) this.play(alias);
    },
    preloadByGroup(group) {
      this.groups[group]?.soundsAliases.forEach((alias) => {
        this.library[alias].load();
      });
    },
    preload(alias) {
      this.library[alias].load();
    },
    stopPlayingSound() {
      Howler.stop();
    },
    play(alias) {
      const state = this.library[alias].state();
      if ("unloaded" !== state && "loading" !== state && this.isUnlocked) {
        return this.library[alias].play(),
          this.library[alias]
      }
    },
    initBallteMusic() {
      const settingsStore = useSettingsStore();
      const music_battle_group = settingsStore.music_battle_group

      const localMusicMap = [
        { alias: "battle:play", src: BattlePlay },
        { alias: "battle:gotItem", src: BattleGotItem },
        { alias: "battle:totalCount", src: BattleTotalCount },
        { alias: "battle:selectWinner", src: BattleSelectWinner },
        { alias: "battle:battleToggle", src: BattleToggle },
      ];
      // const remoteKeys = Object.keys(music_battle_group ?? {});
      let ballte_group = [];
      localMusicMap.map((item) => {
        if (music_battle_group[item.alias] && music_battle_group[item.alias].length > 0) {
          ballte_group.push({
            alias: item.alias,
            src: music_battle_group[item.alias],
            preload: true,
            group: "battle:tick"
          })
        } else {
          ballte_group.push({
            alias: item.alias,
            src: item.src,
            preload: true,
            group: "battle:tick"
          })
        }

      })
      console.log(ballte_group, 156156)
      this.addSoundsToLibrary(ballte_group)
    },
  },
});
