# PlayPod/backend/data.py
# Этот файл содержит данные о музыке, основанные на предоставленном списке.
# Для простоты, ID генерируются последовательно.
# В реальном приложении эти данные, скорее всего, будут храниться в базе данных.

ALBUMS_DATA = [
    {
        "id": "album_001",
        "title": "My Beautiful Dark Twisted Fantasy",
        "artist": "Kanye West",
        "genre": "Хип-хоп",
        "cover_url": "covers/kanyewest.webp", # Путь уже верный, соответствует скриншоту
        "tracks": [
            {"id": "track_001_01", "track_number": 1, "title": "Dark Fantasy", "audio_url": "#", "features": None},
            {"id": "track_001_02", "track_number": 2, "title": "Gorgeous", "audio_url": "#", "features": "Kid Cudi & Raekwon"},
            {"id": "track_001_03", "track_number": 3, "title": "POWER", "audio_url": "#", "features": None},
            {"id": "track_001_04", "track_number": 4, "title": "All of the Lights (Interlude)", "audio_url": "#", "features": None},
            {"id": "track_001_05", "track_number": 5, "title": "All of the Lights", "audio_url": "#", "features": None},
            {"id": "track_001_06", "track_number": 6, "title": "Monster", "audio_url": "#", "features": "Bon Iver, JAY-Z, Nicki Minaj & Rick Ross"},
            {"id": "track_001_07", "track_number": 7, "title": "So Appalled", "audio_url": "#", "features": "CyHi, JAY-Z, Pusha T, RZA"},
            {"id": "track_001_08", "track_number": 8, "title": "Devil In a New Dress", "audio_url": "#", "features": "Rick Ross"},
            {"id": "track_001_09", "track_number": 9, "title": "Runaway", "audio_url": "#", "features": "Pusha T"},
            {"id": "track_001_10", "track_number": 10, "title": "Hell of a Life", "audio_url": "#", "features": None},
            {"id": "track_001_11", "track_number": 11, "title": "Blame Game", "audio_url": "#", "features": "John Legend"},
            {"id": "track_001_12", "track_number": 12, "title": "Lost In the World", "audio_url": "#", "features": "Bon Iver"},
            {"id": "track_001_13", "track_number": 13, "title": "Who Will Survive In America", "audio_url": "#", "features": None},
            {"id": "track_001_14", "track_number": 14, "title": "See Me Now", "audio_url": "#", "features": "Beyoncé, Big Sean & Charlie Wilson"}, # Бонус трек?
        ]
    },
    {
        "id": "album_002",
        "title": "Take Care",
        "artist": "Drake",
        "genre": "Хип-хоп",
        "cover_url": "covers/Drake.jpg", # Путь уже верный, соответствует скриншоту
        "tracks": [
            {"id": "track_002_01", "track_number": 1, "title": "Over My Dead Body", "audio_url": "#", "features": "Chantal Kreviazuk"},
            {"id": "track_002_02", "track_number": 2, "title": "Shot for Me", "audio_url": "#", "features": None},
            {"id": "track_002_03", "track_number": 3, "title": "Headlines", "audio_url": "#", "features": None},
            {"id": "track_002_04", "track_number": 4, "title": "Crew Love", "audio_url": "#", "features": "The Weeknd"},
            {"id": "track_002_05", "track_number": 5, "title": "Take Care", "audio_url": "#", "features": "Rihanna"},
            {"id": "track_002_06", "track_number": 6, "title": "Marvins Room", "audio_url": "#", "features": None},
            {"id": "track_002_07", "track_number": 7, "title": "Buried Alive Interlude", "audio_url": "#", "features": "Kendrick Lamar"},
            {"id": "track_002_08", "track_number": 8, "title": "Under Ground Kings", "audio_url": "#", "features": None},
            {"id": "track_002_09", "track_number": 9, "title": "We'll Be Fine", "audio_url": "#", "features": "Birdman"},
            {"id": "track_002_10", "track_number": 10, "title": "Make Me Proud", "audio_url": "#", "features": "Nicki Minaj"},
            {"id": "track_002_11", "track_number": 11, "title": "Lord Knows", "audio_url": "#", "features": "Rick Ross"},
            {"id": "track_002_12", "track_number": 12, "title": "Cameras", "audio_url": "#", "features": None},
            {"id": "track_002_13", "track_number": 13, "title": "Good Ones Go (Interlude)", "audio_url": "#", "features": None},
            {"id": "track_002_14", "track_number": 14, "title": "Doing It Wrong", "audio_url": "#", "features": "Stevie Wonder"},
            {"id": "track_002_15", "track_number": 15, "title": "The Real Her", "audio_url": "#", "features": "André 3000 & Lil Wayne"},
            {"id": "track_002_16", "track_number": 16, "title": "Look What You've Done", "audio_url": "#", "features": None},
            {"id": "track_002_17", "track_number": 17, "title": "HYFR (Hell Ya Fucking Right)", "audio_url": "#", "features": "Lil Wayne"},
            {"id": "track_002_18", "track_number": 18, "title": "Practice", "audio_url": "#", "features": None},
            {"id": "track_002_19", "track_number": 19, "title": "The Ride", "audio_url": "#", "features": "The Weeknd"},
            {"id": "track_002_20", "track_number": 20, "title": "The Motto", "audio_url": "#", "features": "Lil Wayne"},
            {"id": "track_002_21", "track_number": 21, "title": "Hate Sleeping Alone", "audio_url": "#", "features": None},
        ]
    },
    {
        "id": "album_003",
        "title": "1989",
        "artist": "Taylor Swift",
        "genre": "Поп",
        "cover_url": "covers/taylorswift.png", # ИЗМЕНЕНО - соответствует файлу taylorswift.png на скриншоте
        "tracks": [
            {"id": "track_003_01", "track_number": 1, "title": "Welcome to New York", "audio_url": "#", "features": None},
            {"id": "track_003_02", "track_number": 2, "title": "Blank Space", "audio_url": "#", "features": None},
            {"id": "track_003_03", "track_number": 3, "title": "Style", "audio_url": "#", "features": None},
            {"id": "track_003_04", "track_number": 4, "title": "Out Of The Woods", "audio_url": "#", "features": None},
            {"id": "track_003_05", "track_number": 5, "title": "All You Had To Do Was Stay", "audio_url": "#", "features": None},
            {"id": "track_003_06", "track_number": 6, "title": "Shake It Off", "audio_url": "#", "features": None},
            {"id": "track_003_07", "track_number": 7, "title": "I Wish You Would", "audio_url": "#", "features": None},
            {"id": "track_003_08", "track_number": 8, "title": "Bad Blood", "audio_url": "#", "features": None},
            {"id": "track_003_09", "track_number": 9, "title": "Wildest Dreams", "audio_url": "#", "features": None},
            {"id": "track_003_10", "track_number": 10, "title": "How You Get The Girl", "audio_url": "#", "features": None},
            {"id": "track_003_11", "track_number": 11, "title": "This Love", "audio_url": "#", "features": None},
            {"id": "track_003_12", "track_number": 12, "title": "I Know Places", "audio_url": "#", "features": None},
            {"id": "track_003_13", "track_number": 13, "title": "Clean", "audio_url": "#", "features": None},
        ]
    },
    {
        "id": "album_004",
        "title": "Thank U, Next",
        "artist": "Ariana Grande",
        "genre": "Поп",
        "cover_url": "covers/arianagrande.jpg", # ИЗМЕНЕНО - соответствует файлу arianagrande.jpg на скриншоте
        "tracks": [
            {"id": "track_004_01", "track_number": 1, "title": "imagine", "audio_url": "#", "features": None},
            {"id": "track_004_02", "track_number": 2, "title": "needy", "audio_url": "#", "features": None},
            {"id": "track_004_03", "track_number": 3, "title": "NASA", "audio_url": "#", "features": None},
            {"id": "track_004_04", "track_number": 4, "title": "bloodline", "audio_url": "#", "features": None},
            {"id": "track_004_05", "track_number": 5, "title": "fake smile", "audio_url": "#", "features": None},
            {"id": "track_004_06", "track_number": 6, "title": "bad idea", "audio_url": "#", "features": None},
            {"id": "track_004_07", "track_number": 7, "title": "make up", "audio_url": "#", "features": None},
            {"id": "track_004_08", "track_number": 8, "title": "ghostin", "audio_url": "#", "features": None},
            {"id": "track_004_09", "track_number": 9, "title": "in my head", "audio_url": "#", "features": None},
            {"id": "track_004_10", "track_number": 10, "title": "7 rings", "audio_url": "#", "features": None},
            {"id": "track_004_11", "track_number": 11, "title": "thank u, next", "audio_url": "#", "features": None},
            {"id": "track_004_12", "track_number": 12, "title": "break up with your girlfriend, i’m bored", "audio_url": "#", "features": None},
        ]
    },
    {
        "id": "album_005",
        "title": "Wasting Light",
        "artist": "Foo Fighters",
        "genre": "Рок",
        "cover_url": "covers/wastinglight.jpeg", # ИЗМЕНЕНО - соответствует файлу wastinglight.jpeg на скриншоте
        "tracks": [
            {"id": "track_005_01", "track_number": 1, "title": "Bridge Burning", "audio_url": "#", "features": None},
            {"id": "track_005_02", "track_number": 2, "title": "Rope", "audio_url": "#", "features": None},
            {"id": "track_005_03", "track_number": 3, "title": "Dear Rosemary", "audio_url": "#", "features": "Bob Mould"},
            {"id": "track_005_04", "track_number": 4, "title": "White Limo", "audio_url": "#", "features": None},
            {"id": "track_005_05", "track_number": 5, "title": "Arlandria", "audio_url": "#", "features": None},
            {"id": "track_005_06", "track_number": 6, "title": "These Days", "audio_url": "#", "features": None},
            {"id": "track_005_07", "track_number": 7, "title": "Back & Forth", "audio_url": "#", "features": None},
            {"id": "track_005_08", "track_number": 8, "title": "A Matter of Time", "audio_url": "#", "features": None},
            {"id": "track_005_09", "track_number": 9, "title": "Miss the Misery", "audio_url": "#", "features": None},
            {"id": "track_005_10", "track_number": 10, "title": "I Should Have Known", "audio_url": "#", "features": "Krist Novoselic"},
            {"id": "track_005_11", "track_number": 11, "title": "Walk", "audio_url": "#", "features": None},
        ]
    },
    {
        "id": "album_006",
        "title": "American Idiot",
        "artist": "Green Day",
        "genre": "Рок",
        "cover_url": "covers/americanidiot.jpg", # ИЗМЕНЕНО - соответствует файлу americanidiot.jpg на скриншоте
        "tracks": [
            {"id": "track_006_01", "track_number": 1, "title": "American Idiot", "audio_url": "#", "features": None},
            {"id": "track_006_02", "track_number": 2, "title": "Jesus of Suburbia", "audio_url": "#", "features": None},
            {"id": "track_006_03", "track_number": 3, "title": "Holiday", "audio_url": "#", "features": None},
            {"id": "track_006_04", "track_number": 4, "title": "Boulevard of Broken Dreams", "audio_url": "#", "features": None},
            {"id": "track_006_05", "track_number": 5, "title": "Are We the Waiting", "audio_url": "#", "features": None},
            {"id": "track_006_06", "track_number": 6, "title": "St. Jimmy", "audio_url": "#", "features": None},
            {"id": "track_006_07", "track_number": 7, "title": "Give Me Novacaine", "audio_url": "#", "features": None},
            {"id": "track_006_08", "track_number": 8, "title": "She's a Rebel", "audio_url": "#", "features": None},
            {"id": "track_006_09", "track_number": 9, "title": "Extraordinary Girl", "audio_url": "#", "features": None},
            {"id": "track_006_10", "track_number": 10, "title": "Letterbomb", "audio_url": "#", "features": None},
            {"id": "track_006_11", "track_number": 11, "title": "Wake Me Up When September Ends", "audio_url": "#", "features": None},
            {"id": "track_006_12", "track_number": 12, "title": "Homecoming", "audio_url": "#", "features": None},
            {"id": "track_006_13", "track_number": 13, "title": "Whatsername", "audio_url": "#", "features": None},
        ]
    },
    {
        "id": "album_007",
        "title": "Confessions",
        "artist": "Usher",
        "genre": "R&B",
        "cover_url": "covers/usher.png", # ИЗМЕНЕНО - соответствует файлу usher.png на скриншоте
        "tracks": [
            {"id": "track_007_01", "track_number": 1, "title": "Intro", "audio_url": "#", "features": None},
            {"id": "track_007_02", "track_number": 2, "title": "Yeah!", "audio_url": "#", "features": "Lil Jon & Ludacris"},
            {"id": "track_007_03", "track_number": 3, "title": "Throwback", "audio_url": "#", "features": None},
            {"id": "track_007_04", "track_number": 4, "title": "Confessions (Interlude)", "audio_url": "#", "features": None},
            {"id": "track_007_05", "track_number": 5, "title": "Confessions Part II", "audio_url": "#", "features": None},
            {"id": "track_007_06", "track_number": 6, "title": "Burn", "audio_url": "#", "features": None},
            {"id": "track_007_07", "track_number": 7, "title": "Caught Up", "audio_url": "#", "features": None},
            {"id": "track_007_08", "track_number": 8, "title": "Superstar (Interlude)", "audio_url": "#", "features": None},
            {"id": "track_007_09", "track_number": 9, "title": "Superstar", "audio_url": "#", "features": None},
            {"id": "track_007_10", "track_number": 10, "title": "Truth Hurts", "audio_url": "#", "features": None},
            {"id": "track_007_11", "track_number": 11, "title": "Simple Things", "audio_url": "#", "features": None},
            {"id": "track_007_12", "track_number": 12, "title": "Bad Girl", "audio_url": "#", "features": None},
            {"id": "track_007_13", "track_number": 13, "title": "That's What It's Made For", "audio_url": "#", "features": None},
            {"id": "track_007_14", "track_number": 14, "title": "Can U Handle It?", "audio_url": "#", "features": None},
            {"id": "track_007_15", "track_number": 15, "title": "Do It to Me", "audio_url": "#", "features": None},
            {"id": "track_007_16", "track_number": 16, "title": "Take Your Hand", "audio_url": "#", "features": None},
            {"id": "track_007_17", "track_number": 17, "title": "Follow Me", "audio_url": "#", "features": None},
        ]
    },
    {
        "id": "album_008",
        "title": "Blonde",
        "artist": "Frank Ocean",
        "genre": "R&B",
        "cover_url": "covers/frankocean.jpg", # ИЗМЕНЕНО - соответствует файлу frankocean.jpg на скриншоте
        "tracks": [
            {"id": "track_008_01", "track_number": 1, "title": "Nikes", "audio_url": "#", "features": None},
            {"id": "track_008_02", "track_number": 2, "title": "Ivy", "audio_url": "#", "features": None},
            {"id": "track_008_03", "track_number": 3, "title": "Pink + White", "audio_url": "#", "features": None},
            {"id": "track_008_04", "track_number": 4, "title": "Be Yourself", "audio_url": "#", "features": None},
            {"id": "track_008_05", "track_number": 5, "title": "Solo", "audio_url": "#", "features": None},
            {"id": "track_008_06", "track_number": 6, "title": "Skyline To", "audio_url": "#", "features": None},
            {"id": "track_008_07", "track_number": 7, "title": "Self Control", "audio_url": "#", "features": None},
            {"id": "track_008_08", "track_number": 8, "title": "Good Guy", "audio_url": "#", "features": None},
            {"id": "track_008_09", "track_number": 9, "title": "Nights", "audio_url": "#", "features": None},
            {"id": "track_008_10", "track_number": 10, "title": "Solo (Reprise)", "audio_url": "#", "features": "André 3000"},
            {"id": "track_008_11", "track_number": 11, "title": "Pretty Sweet", "audio_url": "#", "features": None},
            {"id": "track_008_12", "track_number": 12, "title": "Facebook Story", "audio_url": "#", "features": "SebastiAn"},
            {"id": "track_008_13", "track_number": 13, "title": "Close to You", "audio_url": "#", "features": None},
            {"id": "track_008_14", "track_number": 14, "title": "White Ferrari", "audio_url": "#", "features": None},
            {"id": "track_008_15", "track_number": 15, "title": "Seigfried", "audio_url": "#", "features": None},
            {"id": "track_008_16", "track_number": 16, "title": "Godspeed", "audio_url": "#", "features": None},
            {"id": "track_008_17", "track_number": 17, "title": "Futura Free", "audio_url": "#", "features": None},
        ]
    }
]

# Можно также создать список всех треков для удобства, если потребуется
ALL_TRACKS = []
for album in ALBUMS_DATA:
    for track in album["tracks"]:
        ALL_TRACKS.append({
            **track,
            "album_id": album["id"],
            "album_title": album["title"],
            "artist": album["artist"],
            "genre": album["genre"],
            "album_cover_url": album["cover_url"] # Обложка альбома для трека
        })

GENRES = sorted(list(set(album["genre"] for album in ALBUMS_DATA)))
