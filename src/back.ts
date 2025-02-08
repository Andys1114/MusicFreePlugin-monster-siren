import { getAlbumDetail, getSongDetail } from "./api";

/**
 * 获取歌曲详细信息
 * @param musicItem 音乐类
 * @returns 完整信息的音乐类
 */
const getMusicInfo = async function (
    musicItem: IMusic.IMusicItem
) {
    const SongRes = await getSongDetail(musicItem.id.toString());
    const AlbumRes = await getAlbumDetail(SongRes.albumCid);
    const resItem: IMusic.IMusicItem = {
        platform: "塞壬唱片",
        id: SongRes.cid,
        artist: SongRes.artists.join("/"),
        title: SongRes.name,
        album: AlbumRes.name,
        artwork: AlbumRes.coverUrl,
        url: SongRes.sourceUrl,
        lrc: SongRes.lyricUrl
    }
    return resItem;
}

/**
 * 获取音源
 * @param mediaItem 歌曲
 * @param quality 音质
 * @returns 播放链接
 */
const getMediaSource = async function (
    mediaItem: IMusic.IMusicItem,
    quality: IMusic.IQualityKey
) {
    const res = await getSongDetail(mediaItem.id.toString());
    return {
        url: res.sourceUrl,
    };
}