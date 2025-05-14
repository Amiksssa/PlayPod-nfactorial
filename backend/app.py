# PlayPod/backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS 
from data import ALBUMS_DATA, GENRES, ALL_TRACKS 

app = Flask(__name__)
CORS(app) 

@app.route('/api/genres', methods=['GET'])
def get_genres():
    """Возвращает список всех доступных жанров."""
    return jsonify(GENRES)

@app.route('/api/albums', methods=['GET'])
def get_albums():
    genre_filter = request.args.get('genre')
    if genre_filter:
        filtered_albums = [album for album in ALBUMS_DATA if album['genre'].lower() == genre_filter.lower()]
        return jsonify(filtered_albums)
    return jsonify(ALBUMS_DATA)

@app.route('/api/albums/<album_id>', methods=['GET'])
def get_album_by_id(album_id):
    album = next((album for album in ALBUMS_DATA if album['id'] == album_id), None)
    if album:
        return jsonify(album)
    return jsonify({"error": "Album not found"}), 404

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    album_id_filter = request.args.get('album_id')
    genre_filter = request.args.get('genre')

    tracks_to_return = ALL_TRACKS

    if album_id_filter:
        tracks_to_return = [track for track in tracks_to_return if track['album_id'] == album_id_filter]
    
    if genre_filter:
        tracks_to_return = [track for track in tracks_to_return if track['genre'].lower() == genre_filter.lower()]
        
    return jsonify(tracks_to_return)


@app.route('/api/tracks/<track_id>', methods=['GET'])
def get_track_by_id(track_id):
    track = next((track for track in ALL_TRACKS if track['id'] == track_id), None)
    if track:
        return jsonify(track)
    return jsonify({"error": "Track not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
