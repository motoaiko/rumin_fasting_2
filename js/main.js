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