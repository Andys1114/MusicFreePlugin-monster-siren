import axios from "axios";

// 定义接口类型，用于类型检查
interface Artist {
    id: number;
    name: string;
    picUrl: string | null;
    alias: string[];
    albumSize: number;
    picId: number;
    fansGroup: string | null;
    img1v1Url: string;
    img1v1: number;
    trans: string | null;
}

interface Album {
    id: number;
    name: string;
    artist: {
        id: number;
        name: string;
        picUrl: string | null;
        alias: string[];
        albumSize: number;
        picId: number;
        fansGroup: string | null;
        img1v1Url: string;
        img1v1: number;
        trans: string | null;
    };
    publishTime: number;
    size: number;
    copyrightId: number;
    status: number;
    picId: number;
    mark: number;
}

interface Song {
    id: number;
    name: string;
    artists: Artist[];
    album: Album;
    duration: number;
    copyrightId: number;
    status: number;
    alias: string[];
    rtype: number;
    ftype: number;
    mvid: number;
    fee: number;
    rUrl: string | null;
    mark: number;
}

interface Result {
    songs: Song[];
    hasMore: boolean;
    songCount: number;
}
interface Lrc {
    version: number;
    lyric: string;
}

interface LyricApiResponse {
    sgc: boolean;
    sfy: boolean;
    qfy: boolean;
    lrc: Lrc;
    klyric: Lrc;
    tlyric: Lrc;
    romalrc: Lrc;
    code: number;
}
interface ApiResponse {
    result: Result;
    code: number;
}

export async function getNCMSonglyric(
    musicItem: IMusic.IMusicItem,
    url: string
) {


    const keywords = musicItem.title
    const response = await axios.get<ApiResponse>(
        url + "/search",
        { params: { keywords } }
    )
    let id: number = null;

    response.data.result.songs.forEach(song => {
        // console.log(song);

        if (
            song.name == musicItem.title
            && song.album.name == musicItem.album
            && song.artists.some(artist => artist.name.includes(musicItem.artist.split("/").shift()))
        ) {
            id = song.id;
            console.log(
                "ncm name   " + song.album.name + "\n",
                "siren name " + musicItem.album + "\n",
                `ncm art\n`,
                // song.artists,
                "\nsiren art  " + musicItem.artist.split("/").shift() + "\n",
                song.artists.some(artist => artist.name.includes(musicItem.artist.split("/").shift()))
            );

        }
    })
    console.log(id);
    const lyricResponse = await axios.get<LyricApiResponse>(
        url + "/lyric",
        { params: { id } }
    )
    return {
        rawLrc: lyricResponse.data.lrc.lyric,
        translation: lyricResponse.data.tlyric.lyric
    };
}