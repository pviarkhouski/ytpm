const authService = require('../auth/auth.service');

class PlaylistItemsService {
  async getList(playlistId, limit, pageToken) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlistItems.list({
        part: ['snippet'],
        maxResults: limit,
        playlistId: playlistId,
        ...(pageToken && { pageToken })
      });
    } catch (e) {
      throw new Error(`Failed to get playlistItems. Error: ${e.message}`);
    }
    return res.data;
  }

  async insert(playlistId, position, videoId) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlistItems.insert({
        part: ['snippet'],
        resource: {
          'snippet': {
            'playlistId': playlistId,
            'position': position,
            'resourceId': {
              'kind': 'youtube#video',
              'videoId': videoId
            }
          }
        }
      });
    } catch (e) {
      throw new Error(`Failed to insert an item into the playlist. Error: ${e.message}`);
    }
    return res.data;
  }

  async update(playlistItemId, playlistId, position, videoId) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlistItems.update({
        part: ['snippet'],
        resource: {
          'id': playlistItemId,
          'snippet': {
            'playlistId': playlistId,
            'position': position,
            'resourceId': {
              'kind': 'youtube#video',
              'videoId': videoId
            }
          }
        }
      });
    } catch (e) {
      throw new Error(`Failed to update an item in the playlist. Error: ${e.message}`);
    }
    return res.data;
  }

  async delete(playlistItemId) {
    let res;
    try {
      res = await authService.getYoutubeApi().playlistItems.delete({
        'id': playlistItemId
      });
    } catch (e) {
      throw new Error(`Failed to delete an item from the playlist. Error: ${e.message}`);
    }
    return res;
  }
}

module.exports = new PlaylistItemsService();