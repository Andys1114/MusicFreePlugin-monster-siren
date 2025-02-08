import axios from 'axios';
import cheerio from 'cheerio';
import cryptojs from 'crypto-js';
import dayjs from 'dayjs';
import bigInt from 'big-integer';
import he from 'he';
import qs from 'qs';
import { get } from 'cheerio/lib/api/traversing';
import { getAllSongs, getAllAlbums, getAlbumDetail, getSongDetail, searchAlbums } from './api';
import { hasAnyCharacter } from './utils/tools';
import { getNCMSonglyric } from './ncmApi';

// 注意：不要使用async () => {}，hermes不支持异步箭头函数
/**
 * 搜索歌名、专辑名、作者名
 * @param query 搜索关键字
 * @param page 页数
 * @param type 类型
 * @returns 音乐类
 */
const search = async function (
  query: string,
  page: number,
  type: IMedia.SupportMediaType
) {
  switch (type) {
    case "album":
      const albumRes = await searchAlbums(query);
      const albumData: IAlbum.IAlbumItem[] = [];
      for (const album of albumRes.list) {
        if (album.name.includes(query)) {
          // 获取专辑详情
          const albumDetail = await getAlbumDetail(album.cid);

          // 生成musicList
          const musicList = await Promise.all(
            albumDetail.songs.map(async (song) => {
              const songDetail = await getSongDetail(song.cid);
              return {
                platform: "塞壬唱片",
                id: songDetail.cid,
                artist: songDetail.artists.join("/"),
                title: songDetail.name,
                album: album.name,
                artwork: album.coverUrl,
                url: songDetail.sourceUrl,
                lrc: songDetail.lyricUrl
              } as IMusic.IMusicItem;
            })
          );

          albumData.push(
            {
              platform: "塞壬唱片",
              id: album.cid,
              title: album.name,
              artist: album.artistes?.join("/") || "",
              artwork: album.coverUrl,
              musicList
            })
        }
      }
      return { isEnd: albumRes.end, data: albumData as any };
    case "music":
      const AlbumRes = await searchAlbums(query);
      const musicData: IMusic.IMusicItem[] = [];
      // console.log(AlbumRes.list);

      for (const album of AlbumRes.list) {
        const albumDetail = await getAlbumDetail(album.cid);

        for (const song of albumDetail.songs) {
          if (
            song.name.includes(query)
            || song.artistes.some(artist => artist.includes(query))
          ) {
            const songDetail = await getSongDetail(song.cid);
            // console.log(songDetail);
            musicData.push({
              platform: "塞壬唱片",
              id: songDetail.cid,
              artist: songDetail.artists.join("/"),
              title: songDetail.name,
              album: album.name,
              artwork: album.coverUrl,
              url: songDetail.sourceUrl,
              lrc: songDetail.lyricUrl
            });
          }
        }
      }
      return { isEnd: AlbumRes.end, data: musicData };
    default:
      return { isEnd: true, data: [] as any };
  }
};

/**
 * 获取歌词
 * @param musicItem 音乐类
 * @returns 歌词和翻译文本
 */
const getLyric = async function (
  musicItem: IMusic.IMusicItem
) {
  const NCMApiUrl = "https://ncm.nekogan.com"

  let lyric: string = null;
  if (musicItem.lrc != null) {
    lyric = await axios.get(musicItem.lrc)
  }

  const testRes = await axios.get(NCMApiUrl)

  if (testRes.status == 200) {
    return await getNCMSonglyric(musicItem, NCMApiUrl)
  }
  return {
    rawLrc: lyric
  }
}


const pluginInstance: IPlugin.IPluginDefine = {
  platform: "塞壬唱片",
  author: "零点诗人",
  version: "0.0.1",
  cacheControl: "no-cache",
  supportedSearchType: ['album', 'music'],
  // TODO: 在这里把插件剩余的功能补充完整
  search,
  getLyric
  // getMediaSource,
  // getMusicInfo
};

async function test() {
  // const res = await search("冲破穹顶", 1, "music");
  const song: IMusic.IMusicItem = {
    platform: "塞壬唱片",
    id: '125013',
    artist: "塞壬唱片-MSR/山川恵津子",
    title: "秋绪",
    album: "秋绪"
  }
  // await getLyric(song)
  // console.log(await getLyric(song));
  console.log(await search("横山克", 0, 'music'));



}
export default pluginInstance;
// test()
// console.log('冲破穹顶'.includes('冲破'));
// console.log(await search("横山克",0,'music'));
