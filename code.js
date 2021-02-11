const game = {
	//хранит игровое поле
	field: [],
	//true - игра идёт, false -  нет
	status: false,
	//необходима для того, чтобы знать реагировать ли на кнопки
	continueGame: false,
	//количество набранных очков
	score: 0,
	//хранит то состояние поля, которое было до текущего хода
	preField: [],

	checkSave(){
		if((localStorage.getItem('saving_game') != '') && (localStorage.getItem('saving_game') != null)){
			let save = localStorage.getItem('saving_game');
			setting.size = Number(save.slice(0, 1));

			setting.render();
			this.newGame();

			save = save.slice(3, game.length);
			
			for(let i = 0; i < setting.size; i++){
				for(let j = 0; j < setting.size; j++){
					let pos = save.indexOf('_');
					let num = save.slice(0, pos);
					save = save.slice(pos + 1, save.length);
					this.field[i][j] = Number(num);
				}
			}

			this.render();

		}
	},

	start(){
		document.getElementById('win').hidden = true;
		this.score = 0;
		this.randomCeil();
		this.randomCeil();
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				this.preField[i][j] = this.field[i][j];
			}
		}
		game.renderRecord();
	},

	renderRecord(){
		if(localStorage.getItem('record2048_' + setting.size)){
			document.getElementById('record').textContent = localStorage.getItem('record2048_' + setting.size);
		}else{
			localStorage.setItem('record2048_' + setting.size, 0);
		}
	},
	//сохраняет рекорд в localStorage
	save(){
		if(localStorage.getItem('record2048_' + setting.size) < game.score){
			localStorage.setItem('record2048_' +setting.size, game.score);
			document.getElementById("record").textContent = game.score;
		}
	},
	//рандомит число и ставит его в рандомную свобоную клетку
	randomCeil(){
		let mas = [];
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				if(this.field[i][j] == 0){
					mas.push(String(i) + String(j));
				}
			}
		}
		if(mas.length > 0){
			let next = this.random(0, mas.length-1);

			let cell = mas[next];
			let num = this.random(1, 10);

			if(num == 10){
				num = 4;
			}else{
				num = 2;
			}

			this.score += Number(num);
			log(this.score);
			document.getElementById('score_num').textContent = this.score;
			game.save();

			let i = Number(cell.slice(0, 1));
			let j = Number(cell.slice(1, 2));

			this.field[i][j] = Number(num);

		}

		this.render();
	},
	
	up(){
		let a = 0;
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				if(this.field[j][i] != 0){
					let buf = this.field[j][i];
					this.field[j][i] = 0;
					this.field[a][i] = buf;	
					a++;
					this.render();
				}
			}
			a = 0;
		}

		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size - 1; j++){
				if(this.field[j][i] == this.field[j+1][i]){
					this.field[j][i] *= 2;
					this.field[j+1][i] = 0;
					this.render();

					for(let y = j+1; y < setting.size - 1; y++){
						let buf = this.field[y+1][i];
						this.field[y+1][i] = 0;
						this.field[y][i] = buf;
						this.render();
					}
				}
			}
		}
		
		this.checkMove();
	},

	down(){
		let a = setting.size - 1;
		for(let i = 0; i < setting.size; i++){
			for(let j = setting.size - 1; j >= 0; j--){
				if(this.field[j][i] != 0){
					let buf = this.field[j][i];
					this.field[j][i] = 0;
					this.field[a][i] = buf;	
					a--;
					this.render();
				}
			}
			a = setting.size - 1;
		}
		for(let i = 0; i < setting.size; i++){
			for(let j = setting.size - 1; j > 0; j--){
				if(this.field[j][i] == this.field[j-1][i]){
					this.field[j][i] *= 2;
					this.field[j-1][i] = 0;
					this.render();

					for(let y = j-1; y > 0; y--){
						let buf = this.field[y-1][i];
						this.field[y-1][i] = 0;
						this.field[y][i] = buf;
						this.render();
					}
				}
			}
		}

		this.checkMove();
	},

	right(){
		let a = setting.size - 1;
		for(let i = 0; i < setting.size; i++){
			for(let j = setting.size - 1; j >= 0; j--){
				if(this.field[i][j] != 0){
					let buf = this.field[i][j];
					this.field[i][j] = 0;
					this.field[i][a] = buf;	
					a--;
					this.render();
				}
			}
			a = setting.size - 1;
		}
		for(let i = 0; i < setting.size; i++){
			for(let j = setting.size - 1; j > 0; j--){
				if(this.field[i][j] == this.field[i][j-1]){
					this.field[i][j] *= 2;
					this.field[i][j-1] = 0;
					this.render();

					for(let y = j-1; y > 0; y--){
						let buf = this.field[i][y-1];
						this.field[i][y-1] = 0;
						this.field[i][y] = buf;
						this.render();
					}
				}
			}
		}

		this.checkMove();
	},

	left(){
		let a = 0;
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				if(this.field[i][j] != 0){
					let buf = this.field[i][j];
					this.field[i][j] = 0;
					this.field[i][a] = buf;	
					a++;
					this.render();
				}
			}
			a = 0;
		}
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size - 1; j++){
				if(this.field[i][j] == this.field[i][j+1]){
					this.field[i][j] *= 2;
					this.field[i][j+1] = 0;
					this.render();

					for(let y = j+1; y < setting.size - 1; y++){
						let buf = this.field[i][y+1];
						this.field[i][y+1] = 0;
						this.field[i][y] = buf;
						this.render();
					}
				}
			}
		}
		
		this.checkMove();
	},

	reloadMas(){
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				this.preField[i][j] = this.field[i][j];
				if(this.field[i][j] >= 2048){
					document.getElementById('win').hidden = false;
				}
			} 
		}
	},
	//проверяет можно ли сделать ход (есть ли свободные клетки или числа, которые можно сложить)
	checkMove(){
		let res = false;
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				if(this.field[i][j] != this.preField[i][j]){
					res = true;
					i = setting.size;
					j = setting.size;
				}
			}
		}
		if(res == true){
			this.afterMove();
		}
	},

	afterMove(){
		this.randomCeil();
		this.reloadMas();		
		this.savingGame();
		this.checkLose();
		this.render();
	},

	checkLose(){
		let lose = true;
		this.field.forEach( mas => mas.forEach((el) => {if(el == 0){ lose = false; }}));
		
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size - 1; j++){
				if((this.field[i][j] == this.field[i][j+1]) || (this.field[j][i] == this.field[j+1][i])){
					lose = false;
					i = setting.size;
					j = setting.size - 1;
				}
			}
		}

		if(lose == true){
			document.getElementById("status").hidden = false;
			this.status = false;
			localStorage.setItem('saving_game', '');
		}
	},
	//рендерит всё поле из массива 
	render(){
		for(let i = 0; i < setting.size; i++){
			for(let j = 0; j < setting.size; j++){
				let cell = this.findObj(i, j);
				cell.classList.remove('cell0', 'cell2', 'cell4', 'cell8', 'cell16', 'cell2','cell32', 'cell64', 'cell128', 'cell256', 'cell512', 'cell1024', 'cellFull');
				switch(this.field[i][j]){
					case 0:
						cell.classList.add('cell0');
						break;
					case 2:
						cell.classList.add('cell2');
						break;
					case 4:
						cell.classList.add('cell4');
						break;
					case 8:
						cell.classList.add('cell8');
						break;
					case 16:
						cell.classList.add('cell16');
						break;
					case 32:
						cell.classList.add('cell32');
						break;
					case 64:
						cell.classList.add('cell64');
						break;
					case 128:
						cell.classList.add('cell128');
						break;
					case 256:
						cell.classList.add('cell256');
						break;
					case 512:
						cell.classList.add('cell512');
						break;
					case 1024:
						cell.classList.add('cell1024');
						break;
					default: 
						cell.classList.add('cellFull');
				}
				if(this.field[i][j] == 0){
					cell.textContent = '';
				}else{
					cell.textContent = this.field[i][j];
				}
			}
		}
	},
	//находит необходимкю клетку по id и возвращает её
	findObj(i, j){
		let id = "cell_" + i + j;
		let obj = document.getElementById(id);
		return obj;
	},
	//переводит кнопки в действие
	key(event){
		if(game.continueGame == true){
			if(event.key == 'ArrowUp'){
				game.up();
			}
			if(event.key == 'ArrowDown'){
				game.down();
			}
			if(event.key == 'ArrowLeft'){
				game.left();
			}
			if(event.key == 'ArrowRight'){
				game.right();
			}
		}
	},
	//обнуляет текущую игру и стартует новую
	newGame(){
		if(game.status == false){
			this.status = true;
			this.continueGame = true;
			this.field.splice(0, this.field.length);

			for(let i = 0; i < setting.size; i++){
				game.field.push([]);
				game.preField.push([]);
				for(let j = 0; j < setting.size; j++){
					game.field[i].push(0);
					game.preField[i].push(0);
				}
			}
			document.getElementById("status").hidden = true;
			game.start();
		}else{
			document.getElementById('newGame').hidden = false;
			this.continueGame = false;
		}
	},

	savingGame(){
		//строка для сохранения игры в localStorage. Первая цифра - размер поля, далее по порядку значения полей, разделены нижним подкчёркиванием
		let stringRes = setting.size + '__';
		this.field.forEach((line) => line.forEach((el) => stringRes += (String(el) + '_')));
		localStorage.setItem('saving_game', stringRes);
	},


	random(min, max){
  		min = Math.ceil(min);
  		max = Math.floor(max);
  		return Math.floor(Math.random() * (max - min + 1)) + min;
  	},
}
//настройки игры
const setting = {
	//размер поля
	size: 4,
	//если происходит смена поля хранит то в какую сторону необходимо сменить поля, до подтверждения новой игры
	nextComand: '',
	//меняет статус игры при старте новой игры или смене текущего поля во время игры
	changeStatus(status){
		game.status = status;
		document.getElementById('newGame').hidden = true;
		if(status == false){
			if(this.nextComand == 'minus'){
				this.minus();
				localStorage.setItem('saving_game', '');
			}else if(this.nextComand == 'plus'){
				this.plus();
				localStorage.setItem('saving_game', '');
			}else{
				game.newGame();
				game.savingGame();
			}
		}else{
			game.continueGame = true;
		}
	},

	newField(){
		if(game.status == false){
			return true;
		}else{
			document.getElementById('newGame').hidden = false;
			return false;
		}
	},
	//уменьшает поле
	minus(){
		if(this.newField() == true){
			if(this.size > 3){
				this.size -=1;
			}else{
				this.size = 8;
			}
			this.render();
			this.nextComand = '';
		}else{
			this.nextComand = 'minus';
		}
	},
	//увеличивает поле
	plus(){
		if(this.newField() == true){
			if(this.size < 8){
				this.size += 1;
			}else{
				this.size = 3;
			}
			this.render();
			this.nextComand = '';
		}else{
			this.nextComand = 'plus';
		}
	},
	//рендерит игру выбранного размера
	render(){
		document.getElementById('sizeField').textContent = this.size + '*' + this.size;

		let table = document.getElementById('field');
		while(table.rows.length > 0) {
			table.deleteRow(0);
		}

		for(let i = 0; i < this.size; i++){
			let tr = document.createElement("tr");
			table.appendChild(tr);
			for(let j = 0; j < this.size; j++){
				let td = document.createElement("td");
				td.id = 'cell_' + String(i) + String(j);
				td.classList.add("size" + this.size);
				table.rows[i].appendChild(td);
			}
		}

		game.renderRecord();
	}
}

document.onkeyup = game.key;

game.renderRecord();

function log(el){
	console.log(el);
}

document.addEventListener('touchstart', (event) => touchChecker.touchDown(event));
document.addEventListener('touchend', (event) => touchChecker.touchUp(event));

document.addEventListener('pointerdown', (event) => pointChecker.pointDown(event));
document.addEventListener('pointerup', (event) => pointChecker.pointUp(event));

//проверка сохранённой игры
game.checkSave();

//управление игрой через экран (неа мобильных устройствах)
const touchChecker = {
	x: 0,
	y: 0,

	touchDown(e){
		this.x = e.touches[0].clientX;
		this.y = e.touches[0].clientY;
	},

	touchUp(e){
		let resX = e.changedTouches[0].clientX;
		let resY = e.changedTouches[0].clientY;

		if(game.continueGame == true){
			if((Math.abs(resX - this.x) > 50) || (Math.abs(resY - this.y) > 50)){
				if(Math.abs(resX - this.x) > Math.abs(resY - this.y)){
					if(this.x > resX){
						game.left();
					}else{
						game.right();
					}
				}else{
					if(this.y > resY){
						game.up();
					}else{
						game.down();
					}
				}
			}
		}
		
	}
}

//управление игрой при пощи мыши
const pointChecker = {
	x: 0,
	y: 0,

	pointDown(e){
		this.x = e.clientX;
		this.y = e.clientY;
	},

	pointUp(e){
		let resX = e.clientX;
		let resY = e.clientY;

		if(game.continueGame == true){
			if((Math.abs(resX - this.x) > 50) || (Math.abs(resY - this.y) > 50)){
				if(Math.abs(resX - this.x) > Math.abs(resY - this.y)){
					if(this.x > resX){
						game.left();
					}else{
						game.right();
					}
				}else{
					if(this.y > resY){
						game.up();
					}else{
						game.down();
					}
				}
			}
		}
	}
}
