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
// ビフォーアフタースライダー（統合画像・1枚ずつ表示）
// ========================================

var sliderTrack = document.getElementById('resultsSliderTrack');
var prevBtn     = document.getElementById('resultsPrev');
var nextBtn     = document.getElementById('resultsNext');

if (sliderTrack && prevBtn && nextBtn) {

  var currentIndex = 0;
  var slides       = sliderTrack.querySelectorAll('.results__slide');
  var totalSlides  = slides.length;

  function moveSlider() {
    sliderTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

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

  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      moveSlider();
    }
  });

  nextBtn.addEventListener('click', function() {
    if (currentIndex < totalSlides - 1) {
      currentIndex = currentIndex + 1;
      moveSlider();
    }
  });

  moveSlider();

  // ========================================
  // スワイプ（タッチ）操作の追加
  // ========================================

  var touchStartX    = 0;
  var touchEndX      = 0;
  var swipeThreshold = 50; // 50px以上の移動でスワイプと判定

  sliderTrack.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  });

  sliderTrack.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].clientX;

    var diffX = touchEndX - touchStartX;

    if (Math.abs(diffX) < swipeThreshold) {
      return; // 移動が少なすぎる場合は何もしない
    }

    if (diffX < 0) {
      // 左スワイプ → 次へ
      if (currentIndex < totalSlides - 1) {
        currentIndex = currentIndex + 1;
        moveSlider();
      }
    } else {
      // 右スワイプ → 前へ
      if (currentIndex > 0) {
        currentIndex = currentIndex - 1;
        moveSlider();
      }
    }
  });

}

// ========================================
// Instagramスライダー（シームレス無限ループ）
// ========================================

var instagramTrack = document.getElementById('instagramTrack');

// スライダーが存在するページでだけ動かす
if (instagramTrack) {

  // ----------------------------------------
  // ステップ1：オリジナルのアイテムを複製してトラックに追加する
  // ----------------------------------------

  // 最初から入っているアイテム（1セット分）を全て取得する
  var originalItems = instagramTrack.querySelectorAll('.instagram__item');

  // 各アイテムをコピーして、トラックの末尾に追加する
  originalItems.forEach(function(item) {
    var clone = item.cloneNode(true);        // 中の画像ごとコピー
    clone.setAttribute('aria-hidden', 'true'); // 読み上げ対象から外す
    instagramTrack.appendChild(clone);       // トラックの末尾に追加
  });


  // ----------------------------------------
  // ステップ2：1セット分の合計幅を正確に計測する
  // ----------------------------------------

  // ★ スピードを変えたいときはこの数字を変える（px/フレーム）
  // 小さくするとゆっくり、大きくすると速くなる
  var speed = 0.5;

  // 現在のスクロール位置（px）を記録する変数
  var currentX = 0;

  // 1セット分の合計幅（アイテムの幅 + gap の合計）
  // DOMが描画されてから計測するため、関数の中で取得する
  var oneSetWidth = 0;

  function calcOneSetWidth() {
    // 最初の1セット分のアイテムを取得（全体の前半分）
    var items = instagramTrack.querySelectorAll('.instagram__item');
    var count = originalItems.length; // オリジナルの枚数（8枚）

    var total = 0;
    for (var i = 0; i < count; i++) {
      // getBoundingClientRect() でアイテムの実際の幅を取得する
      total += items[i].getBoundingClientRect().width;
    }

    // gap（12px）× アイテム数 分も合計に加える
    var gap = 12;
    total += gap * count;

    return total;
  }


  // ----------------------------------------
  // ステップ3：毎フレーム少しずつ左に動かしてループさせる
  // ----------------------------------------

  function animate() {

    // 1セット分の幅を計測（初回のみ実質的に意味がある）
    if (oneSetWidth === 0) {
      oneSetWidth = calcOneSetWidth();
    }

    // 毎フレーム speed（px）だけ左に進める
    currentX += speed;

    // 1セット分だけ進んだら、位置を0にリセットする
    // このリセットの瞬間に2セット目の先頭が1セット目と
    // 完全に同じ位置に見えるため、ガタつきが起きない
    if (currentX >= oneSetWidth) {
      currentX = 0;
    }

    // トラックを左にずらす
    instagramTrack.style.transform = 'translateX(-' + currentX + 'px)';

    // 次のフレームで再び animate() を呼び出す（ループ）
    requestAnimationFrame(animate);
  }

  // アニメーション開始
  requestAnimationFrame(animate);


  // ----------------------------------------
  // ステップ4：画面リサイズ時に幅を再計測する
  // ----------------------------------------

  window.addEventListener('resize', function() {
    // リサイズしたら幅をリセットして再計測させる
    oneSetWidth = 0;
    currentX = 0;
  });

}

// ========================================
// お客様の声スライダー（手動・PC3枚/スマホ1枚）
// ========================================

var voiceTrack = document.getElementById('voiceTrack');
var voicePrev  = document.getElementById('voicePrev');
var voiceNext  = document.getElementById('voiceNext');

if (voiceTrack && voicePrev && voiceNext) {

  var voiceIndex   = 0;
  var voiceCards   = voiceTrack.querySelectorAll('.voice__card');
  var voiceTotal   = voiceCards.length; // 6枚
  var voiceVisible = 3;

  // ----------------------------------------
  // 表示枚数を画面幅に応じて切り替える
  // ----------------------------------------
  function updateVoiceVisible() {
    if (window.innerWidth <= 768) {
      voiceVisible = 1; // スマホ：1枚表示
    } else {
      voiceVisible = 3; // PC：3枚表示
    }
  }

  // ----------------------------------------
  // スライドを動かす関数
  // ----------------------------------------
  function moveVoice() {

    // gap はSCSSと合わせる（PC:24px / スマホ:16px）
    var gap = window.innerWidth <= 768 ? 16 : 24;

    // カード1枚の実際の幅 + gap で1ステップ分の移動距離を計算する
    var cardWidth = voiceCards[0].offsetWidth + gap;

    // トラックをずらす
    voiceTrack.style.transform = 'translateX(-' + (voiceIndex * cardWidth) + 'px)';

    // 「前へ」ボタンの活性・非活性
    if (voiceIndex === 0) {
      voicePrev.setAttribute('disabled', 'true');
    } else {
      voicePrev.removeAttribute('disabled');
    }

    // 「次へ」ボタンの活性・非活性
    if (voiceIndex >= voiceTotal - voiceVisible) {
      voiceNext.setAttribute('disabled', 'true');
    } else {
      voiceNext.removeAttribute('disabled');
    }
  }

  // ----------------------------------------
  // 「前へ」ボタンのクリック処理
  // ----------------------------------------
  voicePrev.addEventListener('click', function() {
    if (voiceIndex > 0) {
      voiceIndex = voiceIndex - 1;
      moveVoice();
    }
  });

  // ----------------------------------------
  // 「次へ」ボタンのクリック処理
  // ----------------------------------------
  voiceNext.addEventListener('click', function() {
    if (voiceIndex < voiceTotal - voiceVisible) {
      voiceIndex = voiceIndex + 1;
      moveVoice();
    }
  });

  // ----------------------------------------
  // スワイプ操作（スマホ対応）
  // ----------------------------------------
  var voiceTouchStartX = 0;
  var voiceTouchEndX   = 0;
  var voiceThreshold   = 50; // 50px以上動いたときだけスワイプと判定

  voiceTrack.addEventListener('touchstart', function(e) {
    voiceTouchStartX = e.touches[0].clientX;
  });

  voiceTrack.addEventListener('touchend', function(e) {
    voiceTouchEndX = e.changedTouches[0].clientX;
    var diff = voiceTouchEndX - voiceTouchStartX;

    // しきい値より小さい動きは無視する
    if (Math.abs(diff) < voiceThreshold) return;

    if (diff < 0) {
      // 左スワイプ → 次へ
      if (voiceIndex < voiceTotal - voiceVisible) {
        voiceIndex = voiceIndex + 1;
        moveVoice();
      }
    } else {
      // 右スワイプ → 前へ
      if (voiceIndex > 0) {
        voiceIndex = voiceIndex - 1;
        moveVoice();
      }
    }
  });

  // ----------------------------------------
  // 画面リサイズ時にインデックスと表示枚数をリセットする
  // ----------------------------------------
  window.addEventListener('resize', function() {
    voiceIndex = 0;
    updateVoiceVisible();
    moveVoice();
  });

  // 最初に1回実行して初期状態を整える
  updateVoiceVisible();
  moveVoice();

}