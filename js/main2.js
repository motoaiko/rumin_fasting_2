document.addEventListener('DOMContentLoaded', function () {
	// ========================================
	// よくあるご質問：アコーディオン開閉
	// ========================================

	// すべての質問ボタンを取得する
	const faqQuestions = document.querySelectorAll('.faq__question');

	// 各ボタンにクリックイベントを設定する
	faqQuestions.forEach(function (question) {
		question.addEventListener('click', function () {
			// クリックされたボタンの、直後の回答エリアを取得する
			const answer = question.nextElementSibling;

			// 現在の開閉状態を確認する（'true'なら開いている）
			const isOpen = question.getAttribute('aria-expanded') === 'true';

			// -------------------------------------------
			// 他の開いているアコーディオンを閉じる処理
			// （1つだけ開く動作にしたい場合はこのブロックを残す）
			// （複数同時に開けるようにしたい場合はこのブロックを削除する）
			// -------------------------------------------
			faqQuestions.forEach(function (otherQuestion) {
				if (otherQuestion !== question) {
					// 他のボタンを閉じる状態にする
					otherQuestion.setAttribute('aria-expanded', 'false');
					// 他の回答エリアの高さを0に戻す
					otherQuestion.nextElementSibling.style.maxHeight = null;
				}
			});

			// -------------------------------------------
			// クリックされたアコーディオンの開閉を切り替える
			// -------------------------------------------
			if (isOpen) {
				// 開いていた → 閉じる
				question.setAttribute('aria-expanded', 'false');
				answer.style.maxHeight = null; // max-height を CSS の初期値（0）に戻す
			} else {
				// 閉じていた → 開く
				question.setAttribute('aria-expanded', 'true');
				// scrollHeight：回答エリアの実際の高さを取得してセットする
				answer.style.maxHeight = answer.scrollHeight + 'px';
			}
		});
	});

	// ========================================
	// Instagramスライダー（シームレス無限ループ）
	// ========================================

	var instagramTrack = document.getElementById('instagramTrack');

	if (instagramTrack) {
		var originalItems = instagramTrack.querySelectorAll('.instagram__item');

		originalItems.forEach(function (item) {
			var clone = item.cloneNode(true);
			clone.setAttribute('aria-hidden', 'true');
			instagramTrack.appendChild(clone);
		});

		var speed = 0.5;
		var currentX = 0;
		var oneSetWidth = 0;

		function calcOneSetWidth() {
			var items = instagramTrack.querySelectorAll('.instagram__item');
			var count = originalItems.length;

			var total = 0;
			for (var i = 0; i < count; i++) {
				total += items[i].getBoundingClientRect().width;
			}

			var gap = 12;
			total += gap * count;

			return total;
		}

		function animate() {
			if (oneSetWidth === 0) {
				oneSetWidth = calcOneSetWidth();
			}

			currentX += speed;

			if (currentX >= oneSetWidth) {
				currentX = 0;
			}

			instagramTrack.style.transform = 'translateX(-' + currentX + 'px)';

			requestAnimationFrame(animate);
		}

		requestAnimationFrame(animate);

		window.addEventListener('resize', function () {
			oneSetWidth = 0;
			currentX = 0;
		});
	}

	// ========================================
	// ビフォーアフタースライダー（統合画像・1枚ずつ表示）
	// ========================================
	var sliderTrack = document.getElementById('resultsSliderTrack');
	var prevBtn = document.getElementById('resultsPrev');
	var nextBtn = document.getElementById('resultsNext');

	if (sliderTrack && prevBtn && nextBtn) {
		var currentIndex = 0;
		var slides = sliderTrack.querySelectorAll('.results__slide');
		var totalSlides = slides.length;

		function moveSlider() {
			sliderTrack.style.transform = 'translateX(-' + currentIndex * 100 + '%)';

			if (currentIndex === 0) {
				prevBtn.setAttribute('disabled', 'true');
			} else {
				prevBtn.removeAttribute('disabled');
			}

			if (currentIndex === totalSlides - 1) {
				nextBtn.setAttribute('disabled', 'true');
			} else {
				nextBtn.removeAttribute('disabled');
			}
		}

		prevBtn.addEventListener('click', function () {
			if (currentIndex > 0) {
				currentIndex = currentIndex - 1;
				moveSlider();
			}
		});

		nextBtn.addEventListener('click', function () {
			if (currentIndex < totalSlides - 1) {
				currentIndex = currentIndex + 1;
				moveSlider();
			}
		});

		moveSlider();

		// ----------------------------------------
		// PC・スマホ共通 ドラッグ/スワイプ処理
		// ----------------------------------------
		var isDragging = false;
		var startX = 0;
		var diffX = 0;
		var swipeThreshold = 50; // 50px以上の移動で切り替え

		// 位置取得の共通関数（マウスとタッチの差異を吸収）
		function getX(e) {
			return e.touches ? e.touches[0].clientX : e.clientX;
		}

		function dragStart(e) {
			isDragging = true;
			startX = getX(e);
			diffX = 0;
			// PCでのドラッグ時にテキスト選択や画像めくれが起きるのを防ぐ
			if (e.type === 'mousedown') {
				e.preventDefault();
				sliderTrack.style.cursor = 'grabbing';
			}
		}

		function dragMove(e) {
			if (!isDragging) return;
			var currentX = getX(e);
			diffX = currentX - startX;
		}

		function dragEnd() {
			if (!isDragging) return;
			isDragging = false;
			sliderTrack.style.cursor = 'grab';

			if (Math.abs(diffX) >= swipeThreshold) {
				if (diffX < 0) {
					// 左にドラッグ ➔ 次へ
					if (currentIndex < totalSlides - 1) {
						currentIndex = currentIndex + 1;
					}
				} else {
					// 右にドラッグ ➔ 前へ
					if (currentIndex > 0) {
						currentIndex = currentIndex - 1;
					}
				}
			}
			moveSlider();
		}

		// 初期カーソル設定
		sliderTrack.style.cursor = 'grab';

		// タッチイベント（スマホ）
		sliderTrack.addEventListener('touchstart', dragStart);
		sliderTrack.addEventListener('touchmove', dragMove);
		sliderTrack.addEventListener('touchend', dragEnd);

		// マウスイベント（PC）
		sliderTrack.addEventListener('mousedown', dragStart);
		window.addEventListener('mousemove', dragMove);
		window.addEventListener('mouseup', dragEnd);
	}

	// ========================================
	// お客様の声スライダー（手動・PC3枚/スマホ1枚センター）
	// ========================================
	var voiceTrack = document.getElementById('voiceTrack');
	var voicePrev = document.getElementById('voicePrev');
	var voiceNext = document.getElementById('voiceNext');

	if (voiceTrack && voicePrev && voiceNext) {
		var voiceIndex = 0;
		var voiceCards = voiceTrack.querySelectorAll('.voice__card');
		var voiceTotal = voiceCards.length;
		var voiceVisible = 3;

		function updateVoiceVisible() {
			if (window.innerWidth <= 768) {
				voiceVisible = 1;
			} else {
				voiceVisible = 3;
			}
		}

		function moveVoice() {
			var isMobile = window.innerWidth <= 768;
			var gap = isMobile ? 16 : 24;
			var cardWidth = voiceCards[0].offsetWidth;
			var offset = 0;

			if (isMobile) {
				if (voiceIndex === 0) {
					offset = 0;
				} else {
					var viewportWidth = voiceTrack.parentElement.offsetWidth;
					var trackPaddingLeft = parseFloat(window.getComputedStyle(voiceTrack).paddingLeft);
					var centerOffset = (viewportWidth - cardWidth) / 2;
					offset = (cardWidth + gap) * voiceIndex - centerOffset + trackPaddingLeft;
				}
			} else {
				offset = (cardWidth + gap) * voiceIndex;
			}

			voiceTrack.style.transform = 'translateX(-' + offset + 'px)';

			if (voiceIndex === 0) {
				voicePrev.setAttribute('disabled', 'true');
			} else {
				voicePrev.removeAttribute('disabled');
			}

			if (voiceIndex >= voiceTotal - voiceVisible) {
				voiceNext.setAttribute('disabled', 'true');
			} else {
				voiceNext.removeAttribute('disabled');
			}
		}

		voicePrev.addEventListener('click', function () {
			if (voiceIndex > 0) {
				voiceIndex = voiceIndex - 1;
				moveVoice();
			}
		});

		voiceNext.addEventListener('click', function () {
			if (voiceIndex < voiceTotal - voiceVisible) {
				voiceIndex = voiceIndex + 1;
				moveVoice();
			}
		});

		// ----------------------------------------
		// PC・スマホ共通 ドラッグ/スワイプ処理
		// ----------------------------------------
		var isVoiceDragging = false;
		var voiceStartX = 0;
		var voiceDiffX = 0;
		var voiceThreshold = 50;

		function getVoiceX(e) {
			return e.touches ? e.touches[0].clientX : e.clientX;
		}

		function voiceDragStart(e) {
			isVoiceDragging = true;
			voiceStartX = getVoiceX(e);
			voiceDiffX = 0;

			// PCドラッグ時のリンクの誤動作や画像選択を防ぐ
			if (e.type === 'mousedown') {
				// ユーザーの意図しないテキスト選択などを防ぐ（ただしカード内のリンク要素は殺さないよう配慮）
				if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') {
					e.preventDefault();
				}
				voiceTrack.style.cursor = 'grabbing';
			}
		}

		function voiceDragMove(e) {
			if (!isVoiceDragging) return;
			var currentX = getVoiceX(e);
			voiceDiffX = currentX - voiceStartX;
		}

		function voiceDragEnd(e) {
			if (!isVoiceDragging) return;
			isVoiceDragging = false;
			voiceTrack.style.cursor = 'grab';

			if (Math.abs(voiceDiffX) >= voiceThreshold) {
				if (voiceDiffX < 0) {
					// 左にドラッグ ➔ 次へ
					if (voiceIndex < voiceTotal - voiceVisible) {
						voiceIndex = voiceIndex + 1;
					}
				} else {
					// 右にドラッグ ➔ 前へ
					if (voiceIndex > 0) {
						voiceIndex = voiceIndex - 1;
					}
				}
			}
			moveVoice();
		}

		// 初期カーソル設定
		voiceTrack.style.cursor = 'grab';

		// タッチイベント（スマホ）
		voiceTrack.addEventListener('touchstart', voiceDragStart);
		voiceTrack.addEventListener('touchmove', voiceDragMove);
		voiceTrack.addEventListener('touchend', voiceDragEnd);

		// マウスイベント（PC）
		voiceTrack.addEventListener('mousedown', voiceDragStart);
		window.addEventListener('mousemove', voiceDragMove);
		window.addEventListener('mouseup', voiceDragEnd);

		// リサイズ処理
		window.addEventListener('resize', function () {
			voiceIndex = 0;
			updateVoiceVisible();
			moveVoice();
		});

		updateVoiceVisible();
		moveVoice();
	}
	// ========================================
	// 共通アコーディオン開閉（.c-accordion）
	// ========================================

	// すべての .c-accordion__header ボタンを取得する
	var accordionHeaders = document.querySelectorAll('.c-accordion__header');

	// 各ボタンにクリックイベントを設定する
	accordionHeaders.forEach(function (header) {
		header.addEventListener('click', function () {
			// クリックされたボタンの、直後の本文エリアを取得する
			var body = header.nextElementSibling;

			// 現在の開閉状態を確認する（'true'なら開いている）
			var isOpen = header.getAttribute('aria-expanded') === 'true';

			// ------------------------------------------
			// 他の開いているアコーディオンを閉じる処理
			// （1つだけ開く動作にしたい場合はこのブロックを残す）
			// （複数同時に開けるようにしたい場合はこのブロックを削除する）
			// ------------------------------------------
			accordionHeaders.forEach(function (otherHeader) {
				if (otherHeader !== header) {
					otherHeader.setAttribute('aria-expanded', 'false');
					otherHeader.nextElementSibling.style.maxHeight = null;
				}
			});

			// ------------------------------------------
			// クリックされたアコーディオンの開閉を切り替える
			// ------------------------------------------
			if (isOpen) {
				// 開いていた → 閉じる
				header.setAttribute('aria-expanded', 'false');
				body.style.maxHeight = null; // max-height を CSS の初期値（0）に戻す
			} else {
				// 閉じていた → 開く
				header.setAttribute('aria-expanded', 'true');
				// scrollHeight：本文エリアの実際の高さを取得してセットする
				body.style.maxHeight = body.scrollHeight + 'px';
			}
		});
	});

	/* ---------------- */
	// スクロールフェードアップ（Intersection Observer版）
	/* ---------------- */

	var fadeElements = document.querySelectorAll('.js-fadeup');

	var options = {
		root: null, // 画面（ビューポート）を基準にする
		rootMargin: '-200px 0px 0px 0px', // 下から200px入った位置で判定
		threshold: 0, // 要素が1画素でも入ったら反応
	};

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				// 画面内に入ったとき
				entry.target.classList.add('in-view');
			} else {
				// 画面外に出たとき
				entry.target.classList.remove('in-view');
			}
		});
	}, options); // ← カッコの閉じ方とoptionsを渡す位置を修正
	// すべての対象要素を監視対象に登録
	fadeElements.forEach(function (element) {
		observer.observe(element);
	});
});
