let canvas = document.getElementById("canvas");
let w = h = canvas.width = canvas.height = 0;
let context = canvas.getContext("2d");

let map = [];
let Pmap = [];

// 0 = null, 1 = cable 0, 2 = cable 1, 3 = nand 0; 4 = nand 1; 5 cable spécial 0; 6 cable spécial 1; 7 = input 0; 8 = input 1; 9 bridge

let cell_color = ["#000000", "#005500", "#00ff00", "#ff0000", "#0000ff", "#00bb00", "#77ff77", "#005555", "#00ffff", "#ffff00"]

function draw() {
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            context.fillStyle = cell_color[map[x + y * h]];
            context.fillRect(x, y, 1, 1);
        };
};

function update() {
    Pmap = []
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            let cell = x + y * h;
            if (map[cell] == 1) {
                if (map[cell + h] == 4 || (map[cell + 1] == 6 || map[cell + h] == 6 || map[cell - 1] == 6 || map[cell - h] == 6))
                    Pmap[cell] = 6;
            }
            else if (map[cell] == 2) {
                if (map[cell + h] == 3 || (map[cell + 1] == 5 || map[cell + h] == 5 || map[cell - 1] == 5 || map[cell - h] == 5))
                    Pmap[cell] = 5;
            }
            else if (map[cell] == 3) {
                if (map[cell + 1] == 1 || map[cell - 1] == 1)
                    Pmap[cell] = 4;
            }
            else if (map[cell] == 4) {
                if (map[cell + 1] == 2 && map[cell - 1] == 2)
                    Pmap[cell] = 3;
            }
            else if (map[cell] == 5) {
                Pmap[cell] = 1;
            }
            else if (map[cell] == 6) {
                Pmap[cell] = 2;
            }
            if (map[cell] == 9) {
                if (map[cell + 1] == 6 && map[cell - 1] == 1)
                    Pmap[cell - 1] = 6;
                else if (map[cell - 1] == 6 && map[cell + 1] == 1)
                    Pmap[cell + 1] = 6;
                
                if (map[cell + h] == 6 && map[cell - h] == 1)
                    Pmap[cell - h] = 6;
                else if (map[cell - h] == 6 && map[cell + h] == 1)
                    Pmap[cell + h] = 6;
                
                if (map[cell + 1] == 5 && map[cell - 1] == 2)
                    Pmap[cell - 1] = 5;
                else if (map[cell - 1] == 5 && map[cell + 1] == 2)
                    Pmap[cell + 1] = 5;
                
                if (map[cell + h] == 5 && map[cell - h] == 2)
                    Pmap[cell - h] = 5;
                else if (map[cell - h] == 5 && map[cell + h] == 2)
                    Pmap[cell + h] = 5;
            }
        };
    for (let i = 0; i < w * h; i++)
        map[i] = Pmap[i] ? Pmap[i] : map[i]
};

function main() {
    update();
    draw();
};

function Event(file) {
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => Convert(img);
};

function Convert(img) {
    w = canvas.width = img.width;
    h = canvas.height = img.height;

    canvas.addEventListener("click", function(event) {
        let x = Math.floor((event.pageX - canvas.offsetLeft) / ((w * h) / 512)),
            y = Math.floor((event.pageY - canvas.offsetTop)  / ((w * h) / 512));
        let cell = x + y * h;
        if (map[cell] == 7) {
            map[cell] = 8;
            map[cell + 1] = map[cell + 1] == 1 ? 6  : map[cell + 1];
            map[cell + h] = map[cell + h] == 1 ? 6  : map[cell + h];
            map[cell - 1] = map[cell - 1] == 1 ? 6  : map[cell - 1];
            map[cell - h] = map[cell - h] == 1 ? 6  : map[cell - h];
        }
        else if (map[cell] == 8) {
            map[cell] = 7;
            map[cell + 1] = map[cell + 1] == 2 ? 5 : map[cell + 1];
            map[cell + h] = map[cell + h] == 2 ? 5 : map[cell + h];
            map[cell - 1] = map[cell - 1] == 2 ? 5 : map[cell - 1];
            map[cell - h] = map[cell - h] == 2 ? 5 : map[cell - h];
        };
    });
    context.drawImage(img, 0, 0);
    let data = context.getImageData(0, 0, img.width, img.height).data;
    for (let y = 0; y < img.height; y++)
        for (let x = 0; x < img.width; x++) {
            let color = (data[(x + y * img.height) * 4] << 16) | (data[(x + y * img.height) * 4 + 1] << 8) | (data[(x + y * img.height) * 4 + 2]);
            map[x + y * h] = color == 0x000000 ? 0 : color == 0x005500 ? 1 : color == 0x0000ff ? 4 : color == 0x005555 ? 7 : color == 0xffff00 ? 9 : 0;
        };
    setInterval(() => {
        main();
    });
};
