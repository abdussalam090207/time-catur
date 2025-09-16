        document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const whiteTimeDisplay = document.getElementById('whiteTime');
            const blackTimeDisplay = document.getElementById('blackTime');
            const playerWhite = document.getElementById('playerWhite');
            const playerBlack = document.getElementById('playerBlack');
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            const resetBtn = document.getElementById('resetBtn');
            const settingsBtn = document.getElementById('settingsBtn');
            const minutesInput = document.getElementById('minutes');
            const secondsInput = document.getElementById('seconds');
            const applySettingsBtn = document.getElementById('applySettings');
            const settingsPanel = document.getElementById('settingsPanel');
            const overlay = document.getElementById('overlay');

            // Variables
            let whiteTime = 5 * 60; // 5 minutes in seconds
            let blackTime = 5 * 60; // 5 minutes in seconds
            let currentPlayer = 'white';
            let timerInterval = null;
            let isRunning = false;
            let lowTimeThreshold = 30; // 30 seconds

            // Format time to MM:SS
            function formatTime(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }

            // Update displays
            function updateDisplays() {
                whiteTimeDisplay.textContent = formatTime(whiteTime);
                blackTimeDisplay.textContent = formatTime(blackTime);
                
                // Add low time warning
                whiteTimeDisplay.classList.toggle('low-time', whiteTime <= lowTimeThreshold && whiteTime > 0);
                blackTimeDisplay.classList.toggle('low-time', blackTime <= lowTimeThreshold && blackTime > 0);
            }

            // Switch player
            function switchPlayer() {
                currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                playerWhite.classList.toggle('active', currentPlayer === 'white');
                playerBlack.classList.toggle('active', currentPlayer === 'black');
            }

            // Start timer
            function startTimer() {
                if (isRunning) return;
                
                isRunning = true;
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                resetBtn.disabled = false;
                settingsBtn.disabled = true;
                
                timerInterval = setInterval(() => {
                    if (currentPlayer === 'white') {
                        whiteTime--;
                        if (whiteTime <= 0) {
                            clearInterval(timerInterval);
                            whiteTime = 0;
                            alert('Waktu untuk PUTIH habis! HITAM menang!');
                            isRunning = false;
                            resetButtons();
                        }
                    } else {
                        blackTime--;
                        if (blackTime <= 0) {
                            clearInterval(timerInterval);
                            blackTime = 0;
                            alert('Waktu untuk HITAM habis! PUTIH menang!');
                            isRunning = false;
                            resetButtons();
                        }
                    }
                    
                    updateDisplays();
                }, 1000);
            }

            // Reset buttons state
            function resetButtons() {
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                resetBtn.disabled = true;
                settingsBtn.disabled = false;
            }

            // Pause timer
            function pauseTimer() {
                if (!isRunning) return;
                
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                settingsBtn.disabled = false;
            }

            // Reset timer
            function resetTimer() {
                clearInterval(timerInterval);
                isRunning = false;
                
                // Reset to initial time
                const minutes = parseInt(minutesInput.value) || 0;
                const seconds = parseInt(secondsInput.value) || 0;
                const totalSeconds = minutes * 60 + seconds;
                
                whiteTime = totalSeconds;
                blackTime = totalSeconds;
                currentPlayer = 'white';
                
                playerWhite.classList.add('active');
                playerBlack.classList.remove('active');
                
                updateDisplays();
                resetButtons();
            }

            // Apply settings
            function applySettings() {
                if (isRunning) {
                    alert('Timer sedang berjalan. Hentikan timer terlebih dahulu sebelum mengubah pengaturan.');
                    return;
                }
                
                const minutes = parseInt(minutesInput.value) || 0;
                const seconds = parseInt(secondsInput.value) || 0;
                
                if (minutes === 0 && seconds === 0) {
                    alert('Waktu tidak boleh nol!');
                    return;
                }
                
                if (seconds > 59) {
                    alert('Detik tidak boleh lebih dari 59!');
                    secondsInput.value = 59;
                    return;
                }
                
                const totalSeconds = minutes * 60 + seconds;
                whiteTime = totalSeconds;
                blackTime = totalSeconds;
                
                updateDisplays();
                closeSettings();
            }

            // Open settings panel
            function openSettings() {
                settingsPanel.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            // Close settings panel
            function closeSettings() {
                settingsPanel.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            // Player click logic - ketika pemain diklik, timer lawan yang berjalan
            playerWhite.addEventListener('click', () => {
                if (isRunning) {
                    if (currentPlayer === 'white') {
                        // Jika putih aktif, klik putih akan mengaktifkan hitam
                        switchPlayer();
                    }
                }
            });

            playerBlack.addEventListener('click', () => {
                if (isRunning) {
                    if (currentPlayer === 'black') {
                        // Jika hitam aktif, klik hitam akan mengaktifkan putih
                        switchPlayer();
                    }
                }
            });

            // Button event listeners
            startBtn.addEventListener('click', startTimer);
            pauseBtn.addEventListener('click', pauseTimer);
            resetBtn.addEventListener('click', resetTimer);
            settingsBtn.addEventListener('click', openSettings);
            applySettingsBtn.addEventListener('click', applySettings);
            overlay.addEventListener('click', closeSettings);

            // Initialize
            updateDisplays();
            playerWhite.classList.add('active');
        });