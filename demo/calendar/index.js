//1900-2100年农历信息
//第一位，代表这年润月的大小月，为1则润大月，为0则润小月。
//中间3位(转换为2进制为12位)，每位代表一个月，为1则为大月(30天)，为0则为小月(29天)。
//最后1位,代表这一年的润月月份，为0则不润。首4位要与末4位搭配使用。*/
const LUNAR_YEARS = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
    0x0d520//2100
];
const BASE_YEAR = 1900;
//1900-2100年节气信息(节气对应的日期为阳历)
//每两位代表一个月内的两个节气, 每位表示一个节气
//对应SOLAR_TERMS_MAP
const SOLAR_TERMS_INFO = [
    "", //暂无1900年数据
    "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j6l6l6m7m8o8o8o9o8n8n", "6l5k7m6l7m7m8o9o9o9o8n8n",
    "7l5k6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j6l6l6m6m8o8o8o9o8n8n",
    "6l5k7m6l7m7m8o9o9o9o8n8n", "7l5k6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m",
    "6l5j6l6l6m6m8o8o8o9o8n8n", "6l5k7m6l7m7m8o9o9o9o8n8n", "7l5k6l5k6l6m7n8n8n9o8n7m",
    "6k4j6l5l6m6m8n8o8o9o8n8m", "6l4j6l5l6m6m8o8o8o9o8n8n", "6l5k6m6l6m7m8o8o9o9o8n8n",
    "6l5k6l5k6l6m7n8n8n8o8m7m", "6k4j6l5l6l6m8n8o8n9o8n7m", "6l4j6l5l6m6m8o8o8o9o8n8m",
    "6l5k6m6l6m7m8o8o9o9o8n8n", "6l5k6l5k6l6m7n8n8n8o8m7m", "6k4j6l5k6l6m8n8o8n9o8n7m",
    "6l4j6l5l6m6m8o8o8o9o8n8m", "6l5j6l6l6m7m8o8o9o9o8n8n", "6l5k6l5k6l6m7n8n8n8o8m7m",
    "6k4j6l5k6l6m8n8o8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j6l6l6m7m8o8o8o9o8n8n",
    "6l5k6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m",
    "6l5j6l6l6m7m8o8o8o9o8n8n", "6l5k6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m",
    "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j6l6l6m6m8o8o8o9o8n8n", "6l5k6l5k6l6l7n8n8n8n7m7m",
    "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j6l6l6m6m8o8o8o9o8n8n",
    "6l5k6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m",
    "6l5j6l6l6m6m8o8o8o9o8n8n", "6l5k6l5k5l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n8o8m7m",
    "6k4j6l5l6m6m8n8o8n9o8n8m", "6l4j6l5l6m6m8o8o8o9o8n8n", "6l5k5l5k5l6l7n7n8n8n7m7m",
    "5k4j6l5k6l6m7n8n8n8o8m7m", "6k4j6l5k6l6m8n8o8n9o8n8m", "6l4j6l5l6m6m8o8o8o9o8n8n",
    "6l5k5l5k5l6l7n7n8n8n7m7m", "5k4j6l5k6l6m7n8n8n8o8m7m", "6k4j6l5k6l6m8n8o8n9o8n7m",
    "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5k5k5k5l6l7n7n8n8n7m7m", "5k4j6l5k6l6m7n8n8n8o8m7m",
    "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j5k5k5l6l7n7n7n8n7m7m",
    "5k4j6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m",
    "6l5j5k5k5l6l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m",
    "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j5k5k5l5l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8n7m7m",
    "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8o9o8n8m", "6l5j5k5k5l5l7n7n7n8n7m7m",
    "5k4j6l5k5l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j6l5l6m6m8n8o8n9o8n8m",
    "6l5j5k4k5l5l7n7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m", "6k4j6l5k6l6m7n8n8n8o8n7m",
    "6l4j6l5l6l6m8n8o8n9o8n8m", "6l5j5k4k5l5l7n7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m",
    "6k4j6l5k6l6m7n8n8n8o8m7m", "6k4j6l5k6l6m8n8o8n9o8n8m", "6l4j5k4k5l5l7m7n7n8n7m7m",
    "5k4j5l5k5l6l7n7n8n8n7m7m", "5k4j6l5k6l6m7n8n8n8o8m7m", "6k4j6l5k6l6m7n8o8n9o8n7m",
    "6l4j5k4k5l5l7m7n7n8n7m7l", "5k4j5k5k5l6l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8o8m7m",
    "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l6l7n7n7n8n7m7m",
    "5k4j6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j5k4k5l5l7m7n7n8n7m7l",
    "5k4i5k5k5l5l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m",
    "6l4j5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8n7m7m",
    "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m",
    "5k4j6l5k5l6l7n7n8n8n7m7m", "6k4j6l5k6l6m7n8n8n9o8n7m", "6l4j5k4k5l5l7m7n7m8n7m7l",
    "5k4i5k4k5l5l7n7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m", "6k4j6l5k6l6m7n8n8n8o8n7m",
    "6l4j5k4k5k5l7m7n7m8n7m7l", "5k4i5k4k5l5l7m7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m",
    "6k4j6l5k6l6m7n8n8n8o8m7m", "6k4j5k4j5k5l7m7n7m8n7m7l", "5k3i5k4k5l5l7m7n7n8n7m7m",
    "5k4j5l5k5l6l7n7n8n8n7m7m", "5k4j6l5k6l6l7n8n8n8o8m7m", "6k4j5k4j5k5l6m7m7m8n7m7l",
    "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4j5k5k5l6l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8o8m7m",
    "6k4j5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m",
    "5k4j6l5k6l6l7n8n8n8n7m7m", "6k4j5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l",
    "5k4i5k5k5l5l7n7n7n8n7m7m", "5k4j6l5k6l6l7n8n8n8n7m7m", "6k4j5k4j5k5l6m7m7m8n7m6l",
    "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m",
    "6k4j5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m",
    "5k4j6l5k5l6l7n7n8n8n7m7m", "6k4j5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5k5l7m7n7m8n7m7l",
    "5k4i5k4k5l5l7n7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m", "6k4j5k4j5k5l6m7m7m7n7m6l",
    "5k3i5k4j5k5l7m7n7m8n7m7l", "5k4i5k4k5l5l7m7n7n8n7m7m", "5k4j6l5k5l6l7n7n8n8n7m7m",
    "6k4j5k4j5k5k6m7m7m7n7l6l", "5j3i5k4j5k5l6m7m7m8n7m7l", "5k3i5k4k5l5l7m7n7n8n7m7m",
    "5k4j5k5k5l6l7n7n7n8n7m7m", "5k4j5k4j5k5k6m7m7m7n7l6l", "5j3i5k4j5k5l6m7m7m8n7m7l",
    "5k3i5k4k5l5l7m7n7n8n7m7m", "5k4j5k5k5l5l7n7n7n8n7m7m", "5k4j5k4j5k5k6m7m7m7n7l6l",
    "5j3i5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4j5k5k5l5l7n7n7n8n7m7m",
    "5k4j5k4j5k5k6m7m7m7m6l6l", "5j3i5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l",
    "5k4i5k5k5l5l7n7n7n8n7m7m", "5k4j5k4j5k5k6m7m7m7m6l6l", "5j3i5k4j5k5l6m7m7m8n7m6l",
    "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m", "5k4j5k4j4k5k6m6m7m7m6l6l",
    "5j3i5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5k5l7m7n7m8n7m7l", "5k4i5k5k5l5l7n7n7n8n7m7m",
    "5k4j5k4j4k5k6m6m7m7m6l6l", "5j3i5k4j5k5l6m7m7m7n7m6l", "5k3i5k4k5k5l7m7n7m8n7m7l",
    "5k4i5k4k5l5l7m7n7n8n7m7m", "5k4j5k4j4k5k6m6m7m7m6l6l", "5j3i5k4j5k5l6m7m7m7n7m6l",
    "5k3i5k4j5k5l6m7n7m8n7m7l", "5k4i5k4k5l5l7m7n7n8n7m7m", "5k4j5k4j4k5k6m6m7m7m6l6l",
    "5j3i5k4j5k5k6m7m7m7n7l6l", "5k3i5k4j5k5l6m7m7m8n7m7l", "5k3i5k4k5l5l7m7n7n8n7m7m",
    "5k4j4j4j4k5k6m6m6m7m6l6l", "4j3i5k4j5k5k6m7m7m7n7l6l", "5j3i5k4j5k5l6m7m7m8n7m7l",
    "5k3i5k4k5l5l7m7n7n8n7m7m", "5k4j4j4j4k4k6m6m6m7m6l6l", "4j3i5k4j5k5k6m7m7m7n7l6l",
    "5j3i5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l", "5k4j4j4j4k4k6m6m6m7m6l6l",
    "4j3i5k4j5k5k6m7m7m7m6l6l", "5j3i5k4j5k5l6m7m7m8n7m6l", "5k3i5k4k5l5l7m7n7n8n7m7l",
    "5k4i4j4j4k4k6m6m6m7m6l6l", "4j3i5k4j5k5k6m6m7m7m6l6l", "5j3i5k4j5k5l6m7m7m8n7m6l",
    "5k3i5k4k5l5l7m7n7n8n7m7l"
];
//对应SOLAR_TERMS中每个字母表示的日期
const SOLAR_TERMS_MAP = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "a": 10,
    "b": 11,
    "c": 12,
    "d": 13,
    "e": 14,
    "f": 15,
    "g": 16,
    "h": 17,
    "i": 18,
    "j": 19,
    "k": 20,
    "l": 21,
    "m": 22,
    "n": 23,
    "o": 24
};
//农历月
const LUNAR_MONTH = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
//阿拉伯数字对应的中文
const DAY_MAP = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
//24节气
const SOLAR_TERMS = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
//天干
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
//地支
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
//生肖
const ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

/**
 * 获取农历年闰月
 * @param {number} year 年(1900-2100之间)
 * @returns {{month: number, type: string}} 闰月的月份和大月还是小月
 */
function getLeapMonth(year) {
    let _year = LUNAR_YEARS[year - BASE_YEAR].toString(16);
    //toString会把第一个0去掉
    _year.length === 4 && (_year = `0${_year}`);
    let first = _year.charAt(0);
    let last= parseInt(_year.charAt(_year.length - 1), 16);
    return {
        month: last,
        type: first
    }
}

/**
 *
 * @param {number} year 年(1900-2100之间)
 * @return {Array} 返回该年的月(二进制, 0为小月, 1为大月)
 */
function getLunarYearMonth(year) {
    let _year = LUNAR_YEARS[year - BASE_YEAR].toString(16),
        lm = getLeapMonth(year),
        len;
    _year.length === 4 && (_year = `0${_year}`);
    _year = _year.substr(1, 3);
    _year = parseInt(_year, 16).toString(2).split("");
    len = _year.length;
    //len小于12时，可能为11(如1901年),也可能为10(如1926年);
    if (len < 12) {
        len = 12 - len;
        for (let i = 0; i < len; i++) {
            _year.unshift("0");
        }
    }
    if (lm.month) _year.splice(lm.month, 0, lm.type);
    return _year;
}

/**
 * 获取农历年总天数
 * @param {number} year 年(1900-2100之间)
 * @return {number} 农历年总天数
 */
function getLunarYearDays(year) {
    let month = getLunarYearMonth(year);
    return month.reduce((sum, current) => {
        return sum + parseInt(current) + 29;
    }, 0);
}

//转换农历日期
function convertDay(day) {
    return day <= 10 ? `初${DAY_MAP[day]}` :
            day < 20 ? `十${DAY_MAP[day % 10]}` :
            day === 20 ? "二十" :
            day < 30 ? `廿${DAY_MAP[day % 20]}` : "三十";
}

//获取农历日期(以正月一号为基准)
function getLunarDate(year, days) {
    let months, month, type;
    if (days < 0) {
        year -= 1;
        days += getLunarYearDays(year);
    } 
    months = getLunarYearMonth(year);
    for (let i = 0, len = months.length; i < len; i++) {
        let tmp = +months[i] + 29;
        if (days <= tmp) {
            month = i;
            type = +months[i];
            break;
        }
        days -= tmp;
    }
    console.log(month)
    months = getLeapMonth(year);
    year = getGanZhiYear(year);
    //闰月
    if (months.month && months.month === month) {
        month -= 1;
    }
    //0为初一,以此类推，所以+1
    days += 1;
    if ((type === 0 && days === 30) || (type === 1 && days === 31)) {
        days = 1;
        month += 1;
    }
    days = convertDay(days);
    return `${year}${LUNAR_MONTH[month]}月${days}`;
}

//公历日期转换为农历日期(1901年及以后)
function solar2Lunar(year, month, day) {
    let base = +new Date("1900-01-31");
    let date = +new Date(`${year}-${month}-${day}`);
    let solarDays = Math.ceil((date - base)/(24 * 60 * 60 * 1000));
    let lunarDays = 0;
    for (let i = BASE_YEAR; i < year; i++) {
        lunarDays += getLunarYearDays(i);
    }
    date = solarDays - lunarDays;
    return getLunarDate(year, date);
}

function formatDate(date) {
    let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();
    return `${y}-${m}-${d}`;
}

//农历转公里(1901年及以后)，公里1900年1月31日为农历正月初一
function lunar2Solar(year, month, day) {
    let days = 0, months = getLunarYearMonth(year);
    for (let i = BASE_YEAR; i < year; i++) {
        days += getLunarYearDays(i);
    }
    for (let i = 0; i < month - 1; i++) {
        days += +months[i] + 29;
    }
    days += day - 1;
    months = +new Date("1900-01-31");
    console.log(days,months + days * 24 * 60 * 60 * 1000)
    return formatDate(new Date(months + days * 24 * 60 * 60 * 1000));
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

//公历每月对应的天数, 月从0开始计算
function getSolarMonthDays(year, month) {
    let days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month];
}

//获取天干地支
function getGanZhiYear(year) {
    //计算甲子年的公式year = 60*x + 4;
    let remainder = (year - 4) % 60,
        hs = remainder % 10,
        eb = remainder % 12;
    return `${HEAVENLY_STEMS[hs]}${EARTHLY_BRANCHES[eb]}`;
}

//获取生肖
function getZodiac(year) {
    let remainder = (year - 4) % 12;
    return ZODIAC[remainder];
}