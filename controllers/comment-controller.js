import * as commentDao from "../dao/comment-dao.js";
import * as playlistDao from "../dao/playlist-dao.js";
import * as userDao from "../dao/user-dao.js";

const createComment = async(req, res) => {
    const newComment = req.body;
    const insertedComment = await commentDao.createComment(newComment);
    res.json(insertedComment);
}

const findComments = async(req, res) => {
    const uid = req.params.uid;
    const comments = await commentDao.findCommentsByUserId(uid);
    const playlistIds = comments.map(c => c.playlist)
    const playlists = await playlistDao.findPlaylistByIds(playlistIds);
    const userIds = playlists.map(p=> p.user)
    const artistsOfPlaylists = await userDao.findUserByIds(userIds);

    const commentsWithDetails = comments.map((c)=> {
        const playlistObj = playlists.filter(p => p._id.toString() == c.playlist.toString())[0];
        const pName = playlistObj.playListName;
        const userObj = artistsOfPlaylists.filter(u=> u._id.toString() ==playlistObj.user.toString())[0];
        return {_id: c._id, playlist: c.playlist, user: c.user, content: c.content, playListName: pName, userName: userObj.userName}
    })
    res.json(commentsWithDetails);
}

const deleteComments = async(req, res) => {
    const cid = req.params.cid;
    const status = await commentDao.deleteComment(cid);
    res.json(status);
}

export default (app) => {
    app.post('/api/comment', createComment);
    app.get('/api/comment/:uid', findComments);
    app.delete('/api/comment/:cid', deleteComments);
}