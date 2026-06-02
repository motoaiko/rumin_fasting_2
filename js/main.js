document.addEventListener('DOMContentLoaded', () => {
	// ========================================
	// 1. よくあるご質問：アコーディオン開閉
	// ========================================
	// 「.faq__question」というクラスを持つ、すべての質問ボタンを取得して箱（リスト）に入れます
	const faqQuestions = document.querySelectorAll('.faq__question');

	// 取得した質問ボタンを、ひとつずつ順番に処理していきます
	faqQuestions.forEach((question) => {
		// それぞれの質問ボタンに、クリックされたときの動きを登録します
		question.addEventListener('click', () => {
			// クリックされた質問ボタンの「すぐ次にある要素（＝回答エリア）」を取得します
			const answer = question.nextElementSibling;
			// 現在アコーディオンが開いているかどうか（HTMLのaria-expanded属性が'true'か）を判定します
			const isOpen = question.getAttribute('aria-expanded') === 'true';

			// 「自分以外の開いているアコーディオン」を一度すべて閉じるループ処理
			faqQuestions.forEach((otherQuestion) => {
				// もし、処理中のボタンが「いまクリックしたボタン」とは別物だった場合
				if (otherQuestion !== question) {
					// その別物ボタンの開閉状態を「閉じ（false）」に設定
					otherQuestion.setAttribute('aria-expanded', 'false');
					// その別物ボタンの回答エリアの最大高さをリセットして消します（＝閉じる）
					otherQuestion.nextElementSibling.style.maxHeight = null;
				}
			});

			// いまクリックされたボタン自身の状態を切り替える処理を始めます
			if (isOpen) {
				// すでに開いていたなら、開閉状態を「閉じ（false）」にします
				question.setAttribute('aria-expanded', 'false');
				// 回答エリアの最大高さをリセットして消します（＝閉じる）
				answer.style.maxHeight = null;
			} else {
				// 閉じていたなら、開閉状態を「開き（true）」にします
				question.setAttribute('aria-expanded', 'true');
				// 回答中身の「実際の文字の高さ（px）」を測り、最大高さ（maxHeight）に指定してなめらかに広げます
				answer.style.maxHeight = `${answer.scrollHeight}px`;
			}
		});
	});

	// ========================================
	// 2. Instagramスライダー（無限ループ）
	// ========================================
	// スライダーを動かすトラック要素を、ID名から取得します
	const instagramTrack = document.getElementById('instagramTrack');

	// もしページ内にそのInstagramトラックが存在する場合のみ、以下の処理を実行
	if (instagramTrack) {
		// トラックの中にある画像をすべて取得
		const originalItems = instagramTrack.querySelectorAll('.instagram__item');

		// 無限ループを作るために、画像をひとつずつ複製して末尾にくっつけます
		originalItems.forEach((item) => {
			// 画像要素の中身をまるごと完全にコピー（複製）します
			const clone = item.cloneNode(true);
			// スクリーンリーダーなどの読み上げソフトに複製画像が重複検知されないよう、隠し属性をつけます
			clone.setAttribute('aria-hidden', 'true');
			// 複製した画像を、トラックの一番最後の位置に追加します
			instagramTrack.appendChild(clone);
		});

		// スライダーが動くスピードを設定
		const speed = 0.5;
		// 現在、左へ何ピクセル動いているかを記録する変数です（初期値は0）
		let currentX = 0;
		// 画像が1ループ（1セット分）するのに必要な全体の横幅を記録する変数です
		let oneSetWidth = 0;

		// オリジナル画像1セット分の正確な横幅（画像の総幅 ＋ 隙間の合計）を計算する関数
		const calcOneSetWidth = () => {
			// 複製されたものも含めて、いまトラック内にあるすべての画像
			const items = instagramTrack.querySelectorAll('.instagram__item');
			// 幅の合計値を足していくための変数を用意します
			let totalWidth = 0;

			// オリジナル画像の枚数分だけ、1枚ずつの正確な横幅を測って足していきます
			for (let i = 0; i < originalItems.length; i++) {
				// ブラウザが実際に描画している最新の要素の横幅（ミリ単位まで正確）を測定して足します
				totalWidth += items[i].getBoundingClientRect().width;
			}

			// CSS（SCSS）のgapで設定している画像同士の隙間のサイズ
			const gap = 12;
			// 「画像の合計幅」に「隙間（12px × 枚数）」を足した、綺麗な1セットの総幅を返します
			return totalWidth + gap * originalItems.length;
		};

		// スライダーを1コマずつ滑らかに動かし続けるアニメーション関数
		const animate = () => {
			// もし全体の横幅がまだ計算されていなければ（初期状態）、横幅を計算して変数に入れます
			if (oneSetWidth === 0) {
				oneSetWidth = calcOneSetWidth();
			}

			// 現在の移動距離（currentX）に、設定したスピード（0.5px）を加算します
			currentX += speed;

			// もし移動した距離が、画像1セット分の総幅を超えた（＝完全に一巡した）ら
			if (currentX >= oneSetWidth) {
				// 移動距離を「0」に戻し、一瞬で左端にリセットします（ユーザーにはループに見えます）
				currentX = 0;
			}

			// トラック要素に対して、計算した距離だけ左方向（マイナス方向）へ動かすCSSをリアルタイムに適用します
			instagramTrack.style.transform = `translateX(-${currentX}px)`;
			// ブラウザの次の描画タイミング（1秒間に約60回）に合わせて、この動かす処理を再実行します
			requestAnimationFrame(animate);
		};

		// 最初のアニメーションの一歩目をスタートさせます
		requestAnimationFrame(animate);

		// ユーザーがスマホの画面の向きを変えたり、ブラウザのサイズを変更（リサイズ）したときの処理です
		window.addEventListener('resize', () => {
			// 画面幅が変わると画像の幅（%やvwなど）も変わるため、計算用の総幅を一度リセットします
			oneSetWidth = 0;
			// 位置のズレを防ぐため、移動中の位置も一度「0」に戻します
			currentX = 0;
		});
	}

	// ========================================
	// 3. スライダー用の共通ドラッグ＆スワイプ制御
	// ========================================
	// 実績スライダーとお客の声スライダーで共通して使える、「引っ張ってめくる」ための型（親関数）を定義します
	const initSliderDrag = (track, onSwipeLeft, onSwipeRight) => {
		// 現在ドラッグ（マウス押し込み or 指タッチ）中かどうかを記録する旗です（初期値は偽）
		let isDragging = false;
		// ドラッグを開始した瞬間の、画面のX座標（横の位置）を記録する変数です
		let startX = 0;
		// 開始位置から「いま何ピクセル横に動いたか」の差分を記録する変数です
		let diffX = 0;
		// スワイプが成立したとみなす移動距離の基準（50px）を設定します
		const swipeThreshold = 50;

		// パソコンのマウスと、スマホの指タッチで、それぞれの「現在の横の座標」を正しく取得するための便利関数です
		const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

		// 画面を押し込んだ（ドラッグを開始した）瞬間の処理です
		const dragStart = (e) => {
			// ドラッグ中フラグを「真（進行中）」にします
			isDragging = true;
			// 押し込んだ瞬間のX座標を取得して記録します
			startX = getX(e);
			// 移動差分を一度リセット（0）にします
			diffX = 0;

			// パソコンのマウスで操作された場合のみ以下の処理をします
			if (e.type === 'mousedown') {
				// クリックした対象がリンクでなければ、ブラウザ特有の「画像のめくれ」や「テキスト選択」の邪魔な挙動を禁止します
				if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') {
					e.preventDefault();
				}
				// マウスのカーソルの形を、掴んでいる状態のアイコン（grabbing）に変えます
				track.style.cursor = 'grabbing';
			}
		};

		// 画面を押し込んだまま、マウスや指を横に動かしている最中（ドラッグ中）の処理です
		const dragMove = (e) => {
			// もし画面を押し込んでいない（ただマウスを動かしているだけ）なら、何もせず処理をスルーします
			if (!isDragging) return;
			// 「現在の位置」から「押し込んだ位置」を引き算して、何ピクセル動いたかの差分（diffX）を計算します
			diffX = getX(e) - startX;
		};

		// マウスを離した、または指を画面から離した（ドラッグが終了した）瞬間の処理です
		const dragEnd = () => {
			// ドラッグ中でなければ、何もせず処理をスルーします
			if (!isDragging) return;
			// ドラッグ状態を終了（false）にします
			isDragging = false;
			// パソコンのカーソルの形を、掴める状態のアイコン（grab）に戻します
			track.style.cursor = 'grab';

			// もし、動かした距離の絶対値（プラスマイナス関係ない純粋な距離）が、基準の50pxを超えていた場合
			if (Math.abs(diffX) >= swipeThreshold) {
				// 差分がマイナス（＝左方向へ引っ張った）なら、「次へ進む」処理を実行します
				if (diffX < 0) {
					onSwipeLeft();
				} else {
					// 差分がプラス（＝右方向へ引っ張った）なら、「前へ戻る」処理を実行します
					onSwipeRight();
				}
			}
		};

		// 初期状態として、スライダー全体に「掴めるよ」と伝える手の形のカーソル（grab）を設定します
		track.style.cursor = 'grab';

		// スマホでのタッチ操作に関するイベント（開始・移動・終了）を登録します
		track.addEventListener('touchstart', dragStart);
		track.addEventListener('touchmove', dragMove);
		track.addEventListener('touchend', dragEnd);
		// パソコンでのマウス操作に関するイベントを登録します（移動と終了は画面全体のどこでも検知できるようにwindowに登録します）
		track.addEventListener('mousedown', dragStart);
		window.addEventListener('mousemove', dragMove);
		window.addEventListener('mouseup', dragEnd);
	};

	// ========================================
	// 4. ビフォーアフタースライダー（1枚ずつ表示）
	// ========================================
	// 実績セクションのスライダートラックと、左右の矢印ボタンをそれぞれID名から取得します
	const sliderTrack = document.getElementById('resultsSliderTrack');
	const prevBtn = document.getElementById('resultsPrev');
	const nextBtn = document.getElementById('resultsNext');

	// 3つの要素がすべてページ内に存在する場合のみ、以下の処理を実行します
	if (sliderTrack && prevBtn && nextBtn) {
		// 現在何枚目のスライドを表示しているかを記録する変数です（最初のスライドは0）
		let currentIndex = 0;
		// スライダーの中にある、スライド（.results__slide）の全体の枚数を数えて記録します
		const totalSlides = sliderTrack.querySelectorAll('.results__slide').length;

		// スライドを現在のインデックス（currentIndex）に合わせて実際に横に動かす関数を作ります
		const moveSlider = () => {
			// スライド1枚分が横幅100%なので、現在の番号 × 100% 分だけ左（マイナス方向）にスライドを動かします
			sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

			// いま最初のスライド（0）なら「前へボタン」を無効化（disabled）し、そうでなければ使えるようにします
			prevBtn.disabled = currentIndex === 0;
			// いま最後のスライドなら「次へボタン」を無効化（disabled）し、そうでなければ使えるようにします
			nextBtn.disabled = currentIndex === totalSlides - 1;
		};

		// 「前へボタン」がクリックされたときの処理です
		prevBtn.addEventListener('click', () => {
			// もし最初のスライド（0）より右にいるなら
			if (currentIndex > 0) {
				// スライドの番号を1つ減らして（前のページに戻る）
				currentIndex--;
				// 実際にスライダーを動かします
				moveSlider();
			}
		});

		// 「次へボタン」がクリックされたときの処理です
		nextBtn.addEventListener('click', () => {
			// もし最後のスライドより手前にいるなら
			if (currentIndex < totalSlides - 1) {
				// スライドの番号を1つ増やして（次のページに進む）
				currentIndex++;
				// 実際にスライダーを動かします
				moveSlider();
			}
		});

		// 先ほど作った「共通ドラッグ機能」を、この実績スライダーにガッチャンコと適用します
		initSliderDrag(
			sliderTrack,
			// 【左へドラッグされたとき（次へ進む）の処理】
			() => {
				if (currentIndex < totalSlides - 1) {
					currentIndex++;
					moveSlider();
				}
			},
			// 【右へドラッグされたとき（前へ戻る）の処理】
			() => {
				if (currentIndex > 0) {
					currentIndex--;
					moveSlider();
				}
			},
		);

		// ページ読み込み時に、初期位置（0枚目）の状態を正しく画面に反映させます
		moveSlider();
	}

	// ========================================
	// 5. お客様の声スライダー（PC3枚/スマホ1枚センター）
	// ========================================
	// お客様の声セクションのスライダートラックと、左右の矢印ボタンをそれぞれID名から取得します
	const voiceTrack = document.getElementById('voiceTrack');
	const voicePrev = document.getElementById('voicePrev');
	const voiceNext = document.getElementById('voiceNext');

	// 3つの要素がすべてページ内に存在する場合のみ、以下の処理を実行します
	if (voiceTrack && voicePrev && voiceNext) {
		// 現在何番目のカードを基準として表示しているかを記録する変数です（初期値は0）
		let voiceIndex = 0;
		// お客様の声カード（.voice__card）の全体の総枚数を数えて記録します
		const voiceCards = voiceTrack.querySelectorAll('.voice__card');
		const voiceTotal = voiceCards.length;
		// 画面に同時に表示するカードの枚数です（初期値はPC用の3枚）
		let voiceVisible = 3;

		// 画面幅を見て、PC表示（3枚）かスマホ表示（1枚）かをチェックして切り替える関数です
		const updateVoiceVisible = () => {
			// 画面の横幅が768px以下なら表示枚数を「1」、それより大きければ「3」にします
			voiceVisible = window.innerWidth <= 768 ? 1 : 3;
		};

		// お客様の声のトラックを計算に基づいて実際に動かす関数を作ります
		const moveVoice = () => {
			// 現在の画面幅が768px以下のスマホ状態かどうかを判定（真偽値）します
			const isMobile = window.innerWidth <= 768;
			// カード同士の隙間（gap）のサイズを、スマホなら16px、PCなら24pxとして扱います
			const gap = isMobile ? 16 : 24;
			// カード1枚が持っている実際の正確な横幅（ピクセル単位）を取得します
			const cardWidth = voiceCards[0].offsetWidth;
			// スライダーを何ピクセル左に動かすかの計算結果を入れる変数です
			let offset = 0;

			// スマホ表示、かつ、2枚目以降のスライド（voiceIndexが0より大きい）を表示する場合の特殊な計算です
			if (isMobile && voiceIndex > 0) {
				// スライダーが見えている外枠（親要素）の横幅を取得します
				const viewportWidth = voiceTrack.parentElement.offsetWidth;
				// SCSSで設定した、スマホ時に右側のカードをチラ見せするための左側余白（padding-left）の数値をブラウザから取得します
				const trackPaddingLeft = parseFloat(window.getComputedStyle(voiceTrack).paddingLeft);
				// カードが外枠の「ピッタリ中央」に来るようにするための補正値を計算します
				const centerOffset = (viewportWidth - cardWidth) / 2;
				// 【カード幅＋隙間】の移動距離から中央補正を引き、さらに左側の余白分を足して、完璧なセンター配置の数値を導き出します
				offset = (cardWidth + gap) * voiceIndex - centerOffset + trackPaddingLeft;
			} else {
				// PC表示、またはスマホの1枚目の場合は、シンプルに【（カード幅＋隙間）× 現在の番号】で移動ピクセル数を計算します
				offset = (cardWidth + gap) * voiceIndex;
			}

			// トラック要素に対して、計算したピクセル数分だけ左方向へ動かすCSSアニメーションを適用します
			voiceTrack.style.transform = `translateX(-${offset}px)`;

			// いま最初のカード（0）なら「前へボタン」を無効化（disabled）します
			voicePrev.disabled = voiceIndex === 0;
			// 残りのカード枚数が表示可能枚数を下回ったら、それ以上進めないよう「次へボタン」を無効化（disabled）します
			voiceNext.disabled = voiceIndex >= voiceTotal - voiceVisible;
		};

		// お客様の声の「前へボタン」がクリックされたときの処理です
		voicePrev.addEventListener('click', () => {
			if (voiceIndex > 0) {
				voiceIndex--;
				moveVoice();
			}
		});

		// お客様の声の「次へボタン」がクリックされたときの処理です
		voiceNext.addEventListener('click', () => {
			if (voiceIndex < voiceTotal - voiceVisible) {
				voiceIndex++;
				moveVoice();
			}
		});

		// 先ほど作った「共通ドラッグ機能」を、このお客様の声スライダーにもガッチャンコと適用します
		initSliderDrag(
			voiceTrack,
			// 【左へドラッグされたとき（次へ進む）の処理】
			() => {
				if (voiceIndex < voiceTotal - voiceVisible) {
					voiceIndex++;
					moveVoice();
				}
			},
			// 【右へドラッグされたとき（前へ戻る）の処理】
			() => {
				if (voiceIndex > 0) {
					voiceIndex--;
					moveVoice();
				}
			},
		);

		// 画面サイズが変更（リサイズ）されたときの処理です
		window.addEventListener('resize', () => {
			// 表示がズレるのを防ぐため、一旦カードの表示位置を「0（最初）」に強制リセットします
			voiceIndex = 0;
			// PC用かスマホ用か、現在の画面サイズに合わせた表示枚数を再チェックします
			updateVoiceVisible();
			// 新しい画面幅に合わせて、位置を再計算して動かします
			moveVoice();
		});

		// ページを開いた瞬間に、PCかスマホかの表示枚数を判定します
		updateVoiceVisible();
		// ページを開いた瞬間の初期位置を画面に正しく反映させます
		moveVoice();
	}

	// ========================================
	// 6. 共通アコーディオン開閉（.c-accordion）
	// ========================================
	// サイト内の各所にある、共通パーツ（c-accordion）の見出し部分をすべて取得します
	const accordionHeaders = document.querySelectorAll('.c-accordion__header');

	// 取得したアコーディオンの見出しを、ひとつずつ順番に処理していきます
	accordionHeaders.forEach((header) => {
		// それぞれの見出しに、クリックされたときの動きを登録します
		header.addEventListener('click', () => {
			// クリックされた見出しの「すぐ次にある要素（＝本文エリア）」を取得します
			const body = header.nextElementSibling;
			// 現在アコーディオンが開いているかどうか（HTMLのaria-expanded属性が'true'か）を判定します
			const isOpen = header.getAttribute('aria-expanded') === 'true';

			// 「自分以外の開いている共通アコーディオン」を一度すべて閉じる処理をはじめます
			accordionHeaders.forEach((otherHeader) => {
				// 処理中の見出しが「いまクリックした見出し」とは別物だった場合
				if (otherHeader !== header) {
					// その別物アコーディオンの開閉状態を「閉じ（false）」にします
					otherHeader.setAttribute('aria-expanded', 'false');
					// その別物アコーディオンの本文エリアの最大高さをリセットして消します（＝閉じる）
					otherHeader.nextElementSibling.style.maxHeight = null;
				}
			});

			// いまクリックされたアコーディオン自身の状態を切り替えます
			if (isOpen) {
				// すでに開いていたなら、開閉状態を「閉じ（false）」にします
				header.setAttribute('aria-expanded', 'false');
				// 本文エリアの最大高さをリセットして消します（＝閉じる）
				body.style.maxHeight = null;
			} else {
				// 閉じていたなら、開閉状態を「開き（true）」にします
				header.setAttribute('aria-expanded', 'true');
				// 本文の中身の「実際の文字の高さ（px）」をリアルタイムに測り、その数値分だけ高さを広げます
				body.style.maxHeight = `${body.scrollHeight}px`;
			}
		});
	});

	// ========================================
	// 7. スクロールフェードアップ（Intersection Observer版）
	// ========================================
	// 画面スクロールでフワッと出したい、すべての要素（.js-fadeup）を取得して箱に入れます
	const fadeElements = document.querySelectorAll('.js-fadeup');

	// アニメーションを発動させる「画面上の境界線」のルールを設定します
	const options = {
		root: null, // 基準にする枠を「ブラウザの画面全体（画面のぞき窓）」に設定します
		rootMargin: '-200px 0px 0px 0px', // 画面の下端から200px内側に入った位置を、発動の境界線（デッドライン）とします
		threshold: 0, // 対象の要素が1ピクセルでもその境界線を踏んだら、すぐにプログラムを発動させます
	};

	// 要素が画面内の境界線を踏んだかどうかを自動で監視してくれる、ブラウザの超軽量な見張り番（Observer）を作ります
	const observer = new IntersectionObserver((entries) => {
		// 見張り番が検知した要素（複数まとめて入る場合もあります）を順番に処理します
		entries.forEach((entry) => {
			// もし要素が、設定した境界線を越えて画面内に入ってきた（交差した）場合
			if (entry.isIntersecting) {
				// その要素に対して、CSS側でフワッと浮かび上がらせるトリガーとなるクラス「in-view」を付与します
				entry.target.classList.add('in-view');
				// 一度表示されたら何度もアニメーションさせる必要はないため、この要素に対する見張りを解除してスマホの電池・動作を軽量化します
				observer.unobserve(entry.target);
			}
		});
	}, options);

	// 最初に対象として取得したすべてのフェードアップ要素（.js-fadeup）を、見張り番に手渡して監視を開始させます
	fadeElements.forEach((element) => observer.observe(element));
});
