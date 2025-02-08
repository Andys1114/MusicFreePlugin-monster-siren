import axios from 'axios';

// ================== 基础类型定义 ==================
interface BaseResponse<T> {
    code: number;
    msg: string;
    data: T;
}

// ================== 专辑相关类型 ==================
interface Album {
    cid: string;
    name: string;
    coverUrl: string;
    artistes: string[];
}

interface AlbumDetail extends Album {
    intro: string;
    belong: string;
    coverDeUrl: string;
    songs: Array<{
        cid: string;
        name: string;
        artistes: string[];
    }>;
}

interface SearchAlbumResult {
    cid: string;
    name: string;
    belong?: string;
    coverUrl: string;
    artistes: string[];
}

// ================== 歌曲相关类型 ==================
interface Song {
    cid: string;
    name: string;
    albumCid: string;
    artists: string[];
}

interface SongDetail {
    cid: string;
    name: string;
    albumCid: string;
    sourceUrl: string;
    lyricUrl: string;
    mvUrl: string | null;
    mvCoverUrl: string | null;
    artists: string[];
}

// ================== API 请求函数 ==================

/**
 * 获取所有专辑列表
 */
export async function getAllAlbums(): Promise<Album[]> {
    const response = await axios.get<BaseResponse<Album[]>>(
        'https://monster-siren.hypergryph.com/api/albums'
    );

    handleResponse(response);
    return response.data.data;
}

/**
 * 获取专辑详细信息
 * @param cid 专辑ID
 */
export async function getAlbumDetail(cid: string): Promise<AlbumDetail> {
    const response = await axios.get<BaseResponse<AlbumDetail>>(
        `https://monster-siren.hypergryph.com/api/album/${cid}/detail`
    );

    handleResponse(response);
    return response.data.data;
}

/**
 * 获取所有歌曲列表
 */
export async function getAllSongs(): Promise<{ list: Song[]; autoplay: string }> {
    const response = await axios.get<BaseResponse<{ list: Song[]; autoplay: string }>>(
        'https://monster-siren.hypergryph.com/api/songs'
    );

    handleResponse(response);
    return response.data.data;
}

/**
 * 搜索专辑
 * @param keyword 搜索关键词
 */
export async function searchAlbums(keyword: string): Promise<{ list: SearchAlbumResult[]; end: boolean }> {
    const response = await axios.get<BaseResponse<{ list: SearchAlbumResult[]; end: boolean }>>(
        'https://monster-siren.hypergryph.com/api/search/album',
        { params: { keyword } }
    );

    handleResponse(response);
    
    return response.data.data;
}

/**
 * 获取歌曲详细信息
 * @param cid 歌曲ID
 */
export async function getSongDetail(cid: string): Promise<SongDetail> {
    const response = await axios.get<BaseResponse<SongDetail>>(
        `https://monster-siren.hypergryph.com/api/song/${cid}`
    );

    handleResponse(response);
    return response.data.data;
}

// ================== 通用响应处理 ==================
function handleResponse(response: any) {
    if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    if (response.data.code !== 0) {
        throw new Error(`API Error: ${response.data.msg}`);
    }
}

// ================== 使用示例 ==================
async function main() {
    try {
        // 示例1: 获取所有专辑
        const albums = await getAllAlbums();
        console.log('All albums:', albums);

        // 示例2: 获取指定专辑详情
        const albumDetail = await getAlbumDetail('9379');
        console.log('Album detail:', albumDetail);

        // 示例3: 搜索专辑
        const searchResult = await searchAlbums('冲破');
        console.log('Search results:', searchResult);

        // 示例4: 获取歌曲详情
        const songDetail = await getSongDetail('232249');
        console.log('Song detail:', songDetail);
    } catch (error) {
        console.error('Request failed:', error instanceof Error ? error.message : error);
    }
}
