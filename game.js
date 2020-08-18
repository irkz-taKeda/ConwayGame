
class Game {

    constructor() {

        this.cell_size = 10;
        this.dead_color = `#181818`;
        this.alive_color = `#fff`;
        this.cells_in_column = Math.floor(canvas.width / this.cell_size);
        this.cells_in_rows = Math.floor(canvas.height / this.cell_size);
        this.active_array = [];
        this.inactive_array = [];
        this.gameSpeed = 100;

        this.arrayInit = () => {
            for (let i = 0; i < this.cells_in_rows; i++) {
                this.active_array[i] = [];
                for (let j = 0; j < this.cells_in_column; j++) {
                    this.active_array[i][j] = 0;
                }
            }
            this.inactive_array = this.active_array;

        };

        this.arrayRandomize = () => {
            console.log(this.inactive_array)
            for (let i = 0; i < this.cells_in_rows; i++) {
                for (let j = 0; j < this.cells_in_column; j++) {
                    this.active_array[i][j] = (Math.random() > 0.5) ? 1 : 0;
                }
            }
            console.log(this.inactive_array)
        };

        this.fillArray = () => {

            for (let i = 0; i < this.cells_in_rows; i++) {
                for (let j = 0; j < this.cells_in_column; j++) {
                    let color;
                    if (this.active_array[i][j] == 1)
                        color = this.alive_color;
                    else
                        color = this.dead_color;
                    ctx.fillStyle = color;
                    ctx.fillRect(j * this.cell_size, i * this.cell_size, this.cell_size, this.cell_size);
                }
            }

        };

        this.setCellValueHelper = (row, col) => {
            try {
                return this.active_array[row][col];
            }
            catch {
                return 0;
            }
        };

        this.countNeighbours = (row, col) => {
            let total_neighbours = 0;
            total_neighbours += this.setCellValueHelper(row - 1, col - 1);
            total_neighbours += this.setCellValueHelper(row - 1, col);
            total_neighbours += this.setCellValueHelper(row - 1, col + 1);
            total_neighbours += this.setCellValueHelper(row, col - 1);
            total_neighbours += this.setCellValueHelper(row, col + 1);
            total_neighbours += this.setCellValueHelper(row + 1, col - 1);
            total_neighbours += this.setCellValueHelper(row + 1, col);
            total_neighbours += this.setCellValueHelper(row + 1, col + 1);
            return total_neighbours;
        };

        this.updateCellValue = (row, col) => {

            const total = this.countNeighbours(row, col);
            if (total > 4 || total < 3) {
                return 0;
            }
            else if (this.active_array[row][col] === 0 && total === 3) {
                return 1;
            }
            else {
                return this.active_array[row][col];
            }

        };

        this.updateLifeCycle = () => {

            for (let i = 0; i < this.cells_in_rows; i++) {
                for (let j = 0; j < this.cells_in_column; j++) {
                    let new_state = this.updateCellValue(i, j);
                    this.inactive_array[i][j] = new_state;
                }
            }
            this.active_array = this.inactive_array

        };

        this.init = () => {
            this.arrayInit();
        };

        this.update = () => {
            this.updateLifeCycle();
            this.fillArray();
        };

        this.start = () => {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.arrayRandomize();
            this.fillArray();
            this.timer = setInterval(this.update, this.gameSpeed);
        }
        
    }
}

const canvas = document.querySelector("#field")
const ctx = canvas.getContext("2d")

const game = new Game()
game.init()

window.onload = () => {

    document.querySelector("#start").addEventListener("click", () => {
        game.start();
    })

    document.querySelector("#stop").addEventListener("click", () => {
        game.init();
    })

}
