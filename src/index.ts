import axios from 'axios';
import cheerio from 'cheerio';
import cryptojs from 'crypto-js';
import dayjs from 'dayjs';
import bigInt from 'big-integer';
import he from 'he';
import qs from 'qs';
import { get } from 'cheerio/lib/api/traversing';
import main from './api';

// TODO: 你可以在这里写插件的逻辑
const baseUrl = "https://monster-siren.hypergryph.com/api"
// APIs
async function getSongs() {
  const res = await axios.get(baseUrl + "/songs");
  return res.data.data;
  return (await axios.get(baseUrl + '/songs')).data.data
}

// 注意：不要使用async () => {}，hermes不支持异步箭头函数
const search: IPlugin.ISearchFunc = async function (query, page, type) {

  
  if (type === 'music') {
    
    return {
      isEnd: true,
      data: []
    }
  };
  // if (type === 'album') {
  //   const res = await axios.get(baseUrl + "/albums");
  //   res.data.
  // }
}


const pluginInstance: IPlugin.IPluginDefine = {
  platform: "塞壬唱片",
  author: "零点诗人",
  version: "0.0.1",
  cacheControl: "no-cache",
  userVariables: [
    {
      key: "NCMApiUrl",
      title: "网易云api地址"
    }
  ],
  // TODO: 在这里把插件剩余的功能补充完整
  search
};


export default pluginInstance;
main()