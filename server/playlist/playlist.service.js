const authService = require('../auth/auth.service');

class PlaylistService {

  async getList(limit, pageToken) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlists.list({
        mine: true,
        part: ['snippet'],
        maxResults: limit,
        ...(pageToken && { pageToken })
      });
    } catch (e) {
      throw new Error(`Failed to get playlists. Error: ${e.message}`);
    }
    return res.data;
  }

  async insert(title) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlists.insert({
        'part': [
          'snippet,status'
        ],
        'resource': {
          'snippet': {
            'title': title,
            'description': '',
            'tags': [],
            'defaultLanguage': 'en'
          },
          'status': {
            'privacyStatus': 'private'
          }
        }
      });
    } catch (e) {
      throw new Error(`Failed to create a new playlist. Error: ${e.message}`);
    }
    return res.data;
  }

  async update(id, title) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlists.update({
        'part': [
          'snippet'
        ],
        'resource': {
          'id': id,
          'snippet': {
            'title': title
          }
        }
      });
    } catch (e) {
      throw new Error(`Failed to update the playlist. Error: ${e.message}`);
    }
    return res.data;
  }

  async delete(id) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlists.delete({
        'id': id
      });
    } catch (e) {
      throw new Error(`Failed to delete the playlist. Error: ${e.message}`);
    }
    return res;
  }
}

module.exports = new PlaylistService();