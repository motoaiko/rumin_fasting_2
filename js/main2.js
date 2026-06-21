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
