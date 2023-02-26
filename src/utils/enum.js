/**
 * 常量區域
 */

// 讀取磨損全稱
export const getFullExterior = (exterior) => {
  switch (exterior) {
    case 1:
      //崭新出厂
      return "Factory-New";
    case 2:
      //略有磨损
      return "Minimal-Wear";
    case 3:
      //久经沙场
      return "Field-Tested";
    case 4:
      //破损不堪
      return "Well-Worn";
    case 5:
      //战痕累累
      return "Battle-Scarred";
    case 6:
      //無塗裝
      return "";
    default:
      return "";
  }
};

/**
 * 讀取磨損簡稱
 * @param {*} val
 * @returns
 */
export const getExterior = (val) => {
  switch (val) {
    case 1:
      //崭新出厂
      return "FN";
    case 2:
      //略有磨损
      return "MW";
    case 3:
      //久经沙场
      return "FT";
    case 4:
      //破损不堪
      return "WW";
    case 5:
      //战痕累累
      return "BS";
    case 6:
      //無塗裝
      return "NA";
    default:
      return "NA";
  }
};
