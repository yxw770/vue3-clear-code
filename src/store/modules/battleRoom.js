

export const useBattleRoomStore = defineStore("battleRoom", {
  state: () => ({
    battle: [],
    rounds: [],
    players: [],
    exit: false,
  }),
  getters: {
    getBattle: (state) => state.battle,
    getRounds: (state) => state.rounds,
    getPlayers: (state) => state.players,
    getExit: (state) => state.exit,

  },
  actions: {
    setBaseData(data) {
      this.exit = false;
      this.battle = {
        cases: data.cases,
        join_payers: data.join_payers,
        max_players: data.max_players,
        round_count: data.round_count,
        status: data.status,
        uid: data.uid,
        worth: data.worth,
      };
      this.rounds = data.rounds.map(round => {
        const case_item = this.battle.cases.find(item => item.case_id === round.case_id);
        // console.log(case_item)
        return {
          ...round,
          ...case_item
        }
      });
      this.players = data.players;
    },
    joinUser(data) {
      console.log(data, 'joinUser')
    },
    reset() {
      this.battle = []
      this.rounds = []
      this.players = []
      this.exit = false
    },
    updataPlayers(data) {
      this.players = data
    },
    getCaseInfo(case_id) {
      return this.battle.cases.find(item => item.case_id === case_id);
    },
  },

});
