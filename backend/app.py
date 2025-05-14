# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from .data import ALBUMS_DATA, ALL_TRACKS, GENRES_DATA # Используем относительный импорт

app = Flask(__name__)
CORS(app)  # Разрешает CORS для всех доменов

@app.route('/api/albums', methods=['GET'])
def get_albums():
    return jsonify(ALBUMS_DATA)

@app.route('/api/albums/<string:album_id>', methods=['GET'])
def get_album(album_id):
    album = next((album for album in ALBUMS_DATA if album["id"] == album_id), None)
    if album:
        return jsonify(album)
    return jsonify({"error": "Album not found"}), 404

@app.route('/api/tracks', methods=['GET'])
def get_all_tracks():
    genre_filter = request.args.get('genre')
    if genre_filter:
        # Фильтруем треки по жанру, не обращая внимания на регистр
        filtered_tracks = [
            track for track in ALL_TRACKS 
            if track.get("genre") and track.get("genre").lower() == genre_filter.lower()
        ]
        return jsonify(filtered_tracks)
    return jsonify(ALL_TRACKS)

@app.route('/api/genres', methods=['GET'])
def get_genres():
    return jsonify(GENRES_DATA)

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Убедись, что порт не занят
