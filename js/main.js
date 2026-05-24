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

// 必要な要素を取得する
var sliderTrack = document.getElementById('resultsSliderTrack');
var prevBtn     = document.getElementById('resultsPrev');
var nextBtn     = document.getElementById('resultsNext');

// スライダーが存在するページでだけ動かす
if (sliderTrack && prevBtn && nextBtn) {

  // 現在表示している枚数のインデックス（0始まり）
  var currentIndex = 0;

  // スライドの総枚数を取得する
  var slides     = sliderTrack.querySelectorAll('.results__slide');
  var totalSlides = slides.length; // 8枚

  // ----------------------------------------
  // スライドを動かす関数
  // ----------------------------------------
  function moveSlider() {

    // インデックス × 100% 分だけトラックを左にずらす
    sliderTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

    // 「前へ」ボタンの活性・非活性を切り替える
    if (currentIndex === 0) {
      prevBtn.setAttribute('disabled', 'true');
    } else {
      prevBtn.removeAttribute('disabled');
    }

    // 「次へ」ボタンの活性・非活性を切り替える
    if (currentIndex === totalSlides - 1) {
      nextBtn.setAttribute('disabled', 'true');
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }

  // ----------------------------------------
  // 「前へ」ボタンのクリック処理
  // ----------------------------------------
  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      moveSlider();
    }
  });

  // ----------------------------------------
  // 「次へ」ボタンのクリック処理
  // ----------------------------------------
  nextBtn.addEventListener('click', function() {
    if (currentIndex < totalSlides - 1) {
      currentIndex = currentIndex + 1;
      moveSlider();
    }
  });

  // 最初に1回実行して初期状態を整える（先頭は「前へ」を非活性に）
  moveSlider();

}