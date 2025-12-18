// 初始化变量
let currentSongIndex = 0;
let isPlaying = false;
let currentMode = 0; // 0:顺序, 1:随机, 2:单曲循环
let currentSpeed = 1.0;

// 歌曲数据
const songs = [
    {
        id: 0,
        title: "耀斑",
        artist: "HOYO-MiX & YMIR",
        album: "崩坏星穹铁道-耀斑 Flares of the Blazing Sun",
        file: "./mp3/music0.mp3",  
        duration: "3:45",
        bg: "img/bg0.png",
        record: "img/record0.jpg"
    },
    {
        id: 1,
        title: "紅蓮華",
        artist: "LiSA",
        album: "紅蓮華",
        file: "./mp3/music1.mp3",  
        duration: "3:57",
        bg: "img/bg1.png",
        record: "img/record1.jpg"
    },
    {
        id: 2,
        title: "Wake Up, Get Up, Get Out There",
        artist: "Lyn",
        album: "Persona 5 OST",
        file: "./mp3/music2.mp3",  
        duration: "4:12",
        bg: "img/bg2.png",
        record: "img/record2.jpg"
    },
{
    id: 3,
    title: "黄嘉华",
    artist: "form:萌萌哒小碗(🐧为啥我每天要上这么久的课啊，我不接受！🐧)",
    album: "25216950233",
    file: "./mp3/music3.mp3",
    duration: "2:33",
    bg: "img/bg3.png",
    record: "img/record3.jpg"
}
];

// DOM元素
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const modeBtn = document.getElementById('mode-btn');
const volumeBtn = document.getElementById('volume-btn');
const listBtn = document.getElementById('list-btn');
const closeListBtn = document.getElementById('close-list-btn');
const speedBtn = document.getElementById('speed-btn');
const musicList = document.getElementById('music-list');
const progressBar = document.getElementById('progress-bar');
const progressDot = document.getElementById('progress-dot');
const pgsPlay = document.querySelector('.pgs-play');
const playedTimeEl = document.querySelectorAll('.played-time');
const audioTimeEl = document.querySelectorAll('.audio-time');
const musicTitle = document.getElementById('music-title');
const authorName = document.getElementById('author-name');
const albumName = document.getElementById('album-name');
const recordImg = document.getElementById('record-img');
const recordArm = document.getElementById('record-arm');
const volumeSlider = document.getElementById('volumn-togger');
const volumeContainer = document.getElementById('volume-container');
const volumeValue = document.querySelector('.volume-value');
const songList = document.getElementById('song-list');
const notification = document.getElementById('notification');

// 初始化
function init() {
    loadSong(currentSongIndex);
    setupEventListeners();
    createParticles();
    updateSongList();
}

// 加载歌曲
function loadSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;
    const song = songs[index];

    audio.src = song.file;
    musicTitle.textContent = song.title;
    authorName.textContent = song.artist;
    albumName.textContent = song.album;

    // 更新唱片图片
    recordImg.style.backgroundImage = `url("${song.record}")`;

    // 更新背景
        const backgroundContainer = document.getElementById('background-container');
    if (backgroundContainer) {
        backgroundContainer.style.backgroundImage = `url("${song.bg}")`;
    }

    // 更新播放列表高亮
    document.querySelectorAll('.music-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // 重置播放状态
    audio.currentTime = 0;
    pgsPlay.style.width = '0%';
    progressDot.style.left = '0%';
    updateTime();

    // 如果之前正在播放，继续播放
    if (isPlaying) {
        // 等待音频元数据加载完成后再播放
        audio.addEventListener('loadedmetadata', () => {
            playSong();
        }, { once: true });
    }
}

// 播放/暂停
function togglePlay() {
    isPlaying ? pauseSong() : playSong();
}

// 设置音频可视化   
function playSong() {

    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(performPlay);
    } else {
        performPlay();
    }
}
function performPlay() {
    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.classList.add('pause');
            playBtn.querySelector('i').className = 'fas fa-pause';
            recordImg.classList.add('playing');
            recordArm.classList.add('playing');
        })
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.classList.remove('pause');
    playBtn.querySelector('i').className = 'fas fa-play';
    recordImg.classList.remove('playing');
    recordArm.classList.remove('playing');
}

// 上一首/下一首
function prevSong() {
    let newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadAndPlay(newIndex);
}

function nextSong() {
    let newIndex;

    if (currentMode === 1) { // 随机播放
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex && songs.length > 1);
    } else { // 顺序播放
        newIndex = (currentSongIndex + 1) % songs.length;
    }

    loadAndPlay(newIndex);
}

function loadAndPlay(index) {
    loadSong(index);
    if (isPlaying) {
        playSong();
    }
}

// 切换播放模式
function changeMode() {
    currentMode = (currentMode + 1) % 3;
    const modes = [
        { icon: 'fas fa-repeat', title: '顺序播放' },
        { icon: 'fas fa-random', title: '随机播放' },
        { icon: 'fas fa-redo', title: '单曲循环' }
    ];

    const { icon, title } = modes[currentMode];
    modeBtn.innerHTML = `<i class="${icon}"></i>`;
    modeBtn.title = title;

    // 如果单曲循环模式，设置audio循环
    audio.loop = currentMode === 2;
}

// 切换播放速度
function changeSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;

    currentSpeed = speeds[nextIndex];
    audio.playbackRate = currentSpeed;
    speedBtn.textContent = `${currentSpeed}x`;
    speedBtn.title = `播放速度：${currentSpeed}x`;

}

// 切换音量控制显示
function toggleVolumeSlider() {
    volumeContainer.classList.toggle('active');
}

// 更新音量
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audio.volume = volume;
    volumeValue.textContent = `${Math.round(volume * 100)}%`;

    // 更新音量图标
    const volumeIcon = volumeBtn.querySelector('i');
    volumeIcon.className = volume === 0
        ? 'fas fa-volume-mute'
        : volume < 0.5
        ? 'fas fa-volume-down'
        : 'fas fa-volume-up';
}

// 更新进度条
function updateProgress(e) {
    const { duration, currentTime } = e.target;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        pgsPlay.style.width = `${progressPercent}%`;
        progressDot.style.left = `${progressPercent}%`;
        updateTime();
    }
}

// 设置进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

// 更新时间显示
function updateTime() {
    const current = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);

    playedTimeEl.forEach(el => el.textContent = current);
    audioTimeEl.forEach(el => el.textContent = duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 显示/隐藏播放列表
function togglePlaylist() {
    musicList.classList.toggle('active');
}

// 更新播放列表
function updateSongList() {
    songList.innerHTML = '';

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `music-item ${index === currentSongIndex ? 'active' : ''}`;
        item.dataset.id = index;

        item.innerHTML = `
            <div class="music-number">${(index + 1).toString().padStart(2, '0')}</div>
            <div class="music-info">
                <div class="music-name">${song.title}</div>
                <div class="music-artist">${song.artist}</div>
            </div>
            <div class="music-duration">${song.duration}</div>
        `;

        item.addEventListener('click', () => {
            loadAndPlay(index);
        });

        songList.appendChild(item);
    });

    // 更新统计信息
    document.getElementById('song-count').textContent = songs.length;
    document.getElementById('total-duration').textContent = formatTime(
        songs.reduce((total, song) => {
            const [mins, secs] = song.duration.split(':').map(Number);
            return total + mins * 60 + secs;
        }, 0)
    );
}

// 设置音频可视化
function playSong() {
    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.classList.add('pause');
            playBtn.querySelector('i').className = 'fas fa-pause';
            recordImg.classList.add('playing');
            recordArm.classList.add('playing');
        })
}
// 创建背景粒子
function createParticles() {
    const particlesBg = document.getElementById('particles-bg');
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            animation: float ${duration}s ease-in-out ${delay}s infinite;
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
        `;

        particlesBg.appendChild(particle);
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { 
                transform: translateY(0) translateX(0) rotate(0deg); 
            }
            25% { 
                transform: translateY(-40px) translateX(0px) rotate(90deg); 
            }
            50% { 
                transform: translateY(-80px) translateX(0) rotate(180deg); 
            }
            75% { 
                transform: translateY(-40px) translateX(-20px) rotate(270deg); 
            }
        }
    `;
    document.head.appendChild(style);
}

// 设置事件监听器
function setupEventListeners() {
    // 播放/暂停
    playBtn.addEventListener('click', togglePlay);

    // 上一首/下一首
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // 播放模式
    modeBtn.addEventListener('click', changeMode);

    // 播放速度
    speedBtn.addEventListener('click', changeSpeed);

    // 音量控制
    volumeBtn.addEventListener('click', toggleVolumeSlider);
    volumeSlider.addEventListener('input', updateVolume);

    // 播放列表
    listBtn.addEventListener('click', togglePlaylist);
    closeListBtn.addEventListener('click', togglePlaylist);

    // 进度条
    progressBar.addEventListener('click', setProgress);

    // 音频事件
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    audio.addEventListener('loadedmetadata', updateTime);

    // MV按钮
    document.getElementById('MV').addEventListener('click', () => {
        sessionStorage.setItem('musicId', currentSongIndex);
        window.open('mv-player.html', '_blank');
    });

    // 点击播放列表外部关闭列表
    document.addEventListener('click', (e) => {
        if (!musicList.contains(e.target) && !listBtn.contains(e.target) && musicList.classList.contains('active')) {
            togglePlaylist();
        }
    });

    // 点击音量控制外部关闭音量控制
    document.addEventListener('click', (e) => {
        if (!volumeContainer.contains(e.target) && !volumeBtn.contains(e.target) && volumeContainer.classList.contains('active')) {
            toggleVolumeSlider();
        }
    });

}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);