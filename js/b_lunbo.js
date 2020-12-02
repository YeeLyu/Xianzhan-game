window.onload = () => {	
	let next_btn = document.getElementById("next");
	let pre_btn = document.getElementById("pre");
	let list = document.getElementById("list");
	let page = list.getElementsByTagName('a');
	let container = document.getElementById("container");
	let dots = document.getElementById("dot").getElementsByTagName("li");
	let left = 0;
	let auto = null;
	let index = 0; // 当前显示图片的下标
	let status = false; // 当前轮播图动画是否在执行

	next_btn.onclick = () => {
		// 检查当前轮播图是否在执行动画中
		if(status) {
			return false;
		}

		let new_index = index + 1 > 2 ? 0 : index + 1; // 得到将要显示图片的下标

		animate2(new_index);
	}

	pre_btn.onclick = () => {
		// 检查当前轮播图是否在执行动画中
		if(status) {
			return false;
		}
		let new_index = index - 1 < 0 ? 2 : index - 1;

		animate2(new_index);
	}

	for(let i = 0; i < dots.length; i++) {
		dots[i].onclick = () => {
			if(index == i || status) {
				return false;
			}

			let new_index = i;
			animate2(new_index);
		}
	}

	// 轮播动画的方法
	function animate(new_left) {
		status = true; // 把动画执行状态设为true
		let left = parseInt(list.style.left);
		let offset = new_left - left; // 总移动距离
		let interval = 10; // 速度的单位时间
		let speed = offset / (1200 / interval); // 在总移动距离下每个单位时间内移动的距离，也就是速度

		function go() {
			left = parseInt(list.style.left); // 当前位置
			let next_left = left + speed; // 当前加上速度就是下一个单位时间所在位置
			list.style.left = next_left + "px";

			if(speed < 0 && next_left >= new_left || speed > 0 && next_left <= new_left) {
				setTimeout(() => {
					go();
				}, interval)
			} else {
				list.style.left = new_left + "px"; // 由于移动可能会有一部偏差，所以最后时把list的位置强制放到终点上
				changeDot();
				status = false; // 动画结束，并且把动画状态设置为false
			}
		}
		go();
	}

	// 淡入淡出的动画方法
	function animate2(new_index) {
		status = true;
		let interval = 10; // 速度的单位时间
		let offset = 1 / (1200 / interval);

		// 整理图片的层级排序
		for(let i = 0; i < page.length; i++) {
			page[i].style.zIndex = -1;
		}
		page[index].style.zIndex = 1;
		page[new_index].style.zIndex = 0; // 把将要显示的图片放到第二层的位置
		page[new_index].style.opacity = 0;

		function go() {
			let opacity = parseFloat(page[index].style.opacity);
			opacity -= offset;
			page[index].style.opacity = opacity;

			let opacity2 = parseFloat(page[new_index].style.opacity);
			opacity2 += offset;
			page[new_index].style.opacity = opacity2;

			// 判断当前图片是否已经完成动画
			if(opacity <= 0) {
				page[0].style.opacity = 0;

				// 重新整理图片层级顺序
				for(let i = 0; i < page.length; i++) {
					page[i].style.zIndex = -1;
					page[i].style.opacity = 1;
				}

				page[new_index].style.zIndex = 1;
				index = new_index;
				changeDot();
				status = false;
			} else {
				setTimeout(() => {
					go()
				}, interval);
			}
		}
		go();
	}

	// 自动轮播图片的方法
	function autoPlay() {
		auto = setInterval(() => {
			next_btn.onclick(); // 每三秒触发下一个的按钮的事件
		}, 2000);
	}

	// 检查并显示对应片图焦点图标签的方法
	function changeDot() {
		for(let i = 0; i < dots.length; i++) {
			if(i == 0) {
				dots[i].className = "p1";
			} else if(i == 1) {
				dots[i].className = "p2";
			} else {
				dots[i].className = "p3";
			}
		}
		if(index == 0) {
			dots[index].className = "p1 on";
		} else if(index == 1) {
			dots[index].className = "p2 on";
		} else {
			dots[index].className = "p3 on";
		}
	}
	autoPlay();
}