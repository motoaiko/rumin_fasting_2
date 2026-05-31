document.addEventListener('DOMContentLoaded', () => {
	// ========================================
	// 1. よくあるご質問：アコーディオン開閉
	// ========================================
	const faqQuestions = document.querySelectorAll('.faq__question');

	faqQuestions.forEach((question) => {
		question.addEventListener('click', () => {
			const answer = question.nextElementSibling;
			const isOpen = question.getAttribute('aria-expanded') === 'true';

			// 自分以外の開いているアコーディオンをすべて閉じる
			faqQuestions.forEach((otherQuestion) => {
				if (otherQuestion !== question) {
					otherQuestion.setAttribute('aria-expanded', 'false');
					otherQuestion.nextElementSibling.style.maxHeight = null;
				}
			});

			// 自分の状態を切り替える
			if (isOpen) {
				question.setAttribute('aria-expanded', 'false');
				answer.style.maxHeight = null;
			} else {
				question.setAttribute('aria-expanded', 'true');
				answer.style.maxHeight = `${answer.scrollHeight}px`; // テンプレートリテラルでスッキリ
			}
		});
	});

	// ========================================
	// 2. Instagramスライダー（無限ループ）
	// ========================================
	const instagramTrack = document.getElementById('instagramTrack');

	if (instagramTrack) {
		const originalItems = instagramTrack.querySelectorAll('.instagram__item');

		// クローン（複製）を作成してトラックの末尾に追加
		originalItems.forEach((item) => {
			const clone = item.cloneNode(true);
			clone.setAttribute('aria-hidden', 'true');
			instagramTrack.appendChild(clone);
		});

		const speed = 0.5;
		let currentX = 0;
		let oneSetWidth = 0;

		// 1セット分の横幅（アイテムの総幅＋隙間）を計算する関数
		const calcOneSetWidth = () => {
			const items = instagramTrack.querySelectorAll('.instagram__item');
			let totalWidth = 0;

			for (let i = 0; i < originalItems.length; i++) {
				totalWidth += items[i].getBoundingClientRect().width;
			}

			const gap = 12;
			return totalWidth + gap * originalItems.length;
		};

		// アニメーションの実行ループ
		const animate = () => {
			if (oneSetWidth === 0) {
				oneSetWidth = calcOneSetWidth();
			}

			currentX += speed;

			// 1セット分進んだら左端リセット
			if (currentX >= oneSetWidth) {
				currentX = 0;
			}

			instagramTrack.style.transform = `translateX(-${currentX}px)`;
			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);

		// 画面サイズ変更時に幅をリセット
		window.addEventListener('resize', () => {
			oneSetWidth = 0;
			currentX = 0;
		});
	}

	// ========================================
	// 3. スライダー用の共通ドラッグ＆スワイプ制御
	// ========================================
	// 💡 ここが今回の最大のリファクタリングです！
	// 2つのスライダー（実績・声）で完全に重複していた長大なドラッグ処理を1つに統合しました。

	const initSliderDrag = (track, onSwipeLeft, onSwipeRight) => {
		let isDragging = false;
		let startX = 0;
		let diffX = 0;
		const swipeThreshold = 50; // 50px以上の移動で切り替え判定

		// マウスとタッチの座標取得の差異を吸収する関数
		const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

		const dragStart = (e) => {
			isDragging = true;
			startX = getX(e);
			diffX = 0;

			if (e.type === 'mousedown') {
				// カード内のリンクを殺さず、ドラッグ時のテキスト選択や画像めくれだけを防ぐ
				if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') {
					e.preventDefault();
				}
				track.style.cursor = 'grabbing';
			}
		};

		const dragMove = (e) => {
			if (!isDragging) return;
			diffX = getX(e) - startX;
		};

		const dragEnd = () => {
			if (!isDragging) return;
			isDragging = false;
			track.style.cursor = 'grab';

			if (Math.abs(diffX) >= swipeThreshold) {
				if (diffX < 0) {
					onSwipeLeft(); // 左へドラッグしたときの処理を実行
				} else {
					onSwipeRight(); // 右へドラッグしたときの処理を実行
				}
			}
		};

		track.style.cursor = 'grab';

		// イベント登録（スマホ・PC共通）
		track.addEventListener('touchstart', dragStart);
		track.addEventListener('touchmove', dragMove);
		track.addEventListener('touchend', dragEnd);
		track.addEventListener('mousedown', dragStart);
		window.addEventListener('mousemove', dragMove);
		window.addEventListener('mouseup', dragEnd);
	};

	// ========================================
	// 4. ビフォーアフタースライダー（1枚ずつ表示）
	// ========================================
	const sliderTrack = document.getElementById('resultsSliderTrack');
	const prevBtn = document.getElementById('resultsPrev');
	const nextBtn = document.getElementById('resultsNext');

	if (sliderTrack && prevBtn && nextBtn) {
		let currentIndex = 0;
		const totalSlides = sliderTrack.querySelectorAll('.results__slide').length;

		const moveSlider = () => {
			sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

			// ボタンの無効化（disabled）の条件分岐をスッキリ整理
			prevBtn.disabled = currentIndex === 0;
			nextBtn.disabled = currentIndex === totalSlides - 1;
		};

		prevBtn.addEventListener('click', () => {
			if (currentIndex > 0) {
				currentIndex--;
				moveSlider();
			}
		});

		nextBtn.addEventListener('click', () => {
			if (currentIndex < totalSlides - 1) {
				currentIndex++;
				moveSlider();
			}
		});

		// 共通ドラッグ機能を適用
		initSliderDrag(
			sliderTrack,
			() => {
				if (currentIndex < totalSlides - 1) {
					currentIndex++;
					moveSlider();
				}
			}, // 左ドラッグ（次へ）
			() => {
				if (currentIndex > 0) {
					currentIndex--;
					moveSlider();
				}
			}, // 右ドラッグ（前へ）
		);

		moveSlider();
	}

	// ========================================
	// 5. お客様の声スライダー（PC3枚/スマホ1枚センター）
	// ========================================
	const voiceTrack = document.getElementById('voiceTrack');
	const voicePrev = document.getElementById('voicePrev');
	const voiceNext = document.getElementById('voiceNext');

	if (voiceTrack && voicePrev && voiceNext) {
		let voiceIndex = 0;
		const voiceCards = voiceTrack.querySelectorAll('.voice__card');
		const voiceTotal = voiceCards.length;
		let voiceVisible = 3;

		const updateVoiceVisible = () => {
			voiceVisible = window.innerWidth <= 768 ? 1 : 3;
		};

		const moveVoice = () => {
			const isMobile = window.innerWidth <= 768;
			const gap = isMobile ? 16 : 24;
			const cardWidth = voiceCards[0].offsetWidth;
			let offset = 0;

			if (isMobile && voiceIndex > 0) {
				const viewportWidth = voiceTrack.parentElement.offsetWidth;
				const trackPaddingLeft = parseFloat(window.getComputedStyle(voiceTrack).paddingLeft);
				const centerOffset = (viewportWidth - cardWidth) / 2;
				offset = (cardWidth + gap) * voiceIndex - centerOffset + trackPaddingLeft;
			} else {
				offset = (cardWidth + gap) * voiceIndex;
			}

			voiceTrack.style.transform = `translateX(-${offset}px)`;

			// ボタンの無効化（disabled）
			voicePrev.disabled = voiceIndex === 0;
			voiceNext.disabled = voiceIndex >= voiceTotal - voiceVisible;
		};

		voicePrev.addEventListener('click', () => {
			if (voiceIndex > 0) {
				voiceIndex--;
				moveVoice();
			}
		});

		voiceNext.addEventListener('click', () => {
			if (voiceIndex < voiceTotal - voiceVisible) {
				voiceIndex++;
				moveVoice();
			}
		});

		// 共通ドラッグ機能を適用
		initSliderDrag(
			voiceTrack,
			() => {
				if (voiceIndex < voiceTotal - voiceVisible) {
					voiceIndex++;
					moveVoice();
				}
			}, // 左ドラッグ（次へ）
			() => {
				if (voiceIndex > 0) {
					voiceIndex--;
					moveVoice();
				}
			}, // 右ドラッグ（前へ）
		);

		window.addEventListener('resize', () => {
			voiceIndex = 0;
			updateVoiceVisible();
			moveVoice();
		});

		updateVoiceVisible();
		moveVoice();
	}

	// ========================================
	// 6. 共通アコーディオン開閉（.c-accordion）
	// ========================================
	const accordionHeaders = document.querySelectorAll('.c-accordion__header');

	accordionHeaders.forEach((header) => {
		header.addEventListener('click', () => {
			const body = header.nextElementSibling;
			const isOpen = header.getAttribute('aria-expanded') === 'true';

			// 自分以外の開いているアコーディオンをすべて閉じる
			accordionHeaders.forEach((otherHeader) => {
				if (otherHeader !== header) {
					otherHeader.setAttribute('aria-expanded', 'false');
					otherHeader.nextElementSibling.style.maxHeight = null;
				}
			});

			if (isOpen) {
				header.setAttribute('aria-expanded', 'false');
				body.style.maxHeight = null;
			} else {
				header.setAttribute('aria-expanded', 'true');
				body.style.maxHeight = `${body.scrollHeight}px`;
			}
		});
	});

	// ========================================
	// 7. スクロールフェードアップ（Intersection Observer版）
	// ========================================
	const fadeElements = document.querySelectorAll('.js-fadeup');

	const options = {
		root: null,
		rootMargin: '-200px 0px 0px 0px',
		threshold: 0,
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('in-view');
				observer.unobserve(entry.target); // 1度だけ実行したら見張りを解除して軽量化
			}
		});
	}, options);

	fadeElements.forEach((element) => observer.observe(element));
});
