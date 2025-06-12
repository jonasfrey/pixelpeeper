
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@2.0.0/mod.js"

import {
    f_o_html_from_o_js,
    f_o_proxified_and_add_listeners,
    f_o_js_a_o_toast,
    f_o_toast,
    o_state_a_o_toast,
    s_css_a_o_toast
} from "https://deno.land/x/handyhelpers@5.3.7/mod.js"


// import { Boolean } from '/three.js-r126/examples/jsm/math/BooleanOperation.js';
// import { STLExporter } from '/three/STLExporter.js';
// if you need more addons/examples download from here...
//  
let s_id_error_msg = 'error_msg'
o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    body{
        min-height: 100vh;
        min-width: 100vw;
    }
    #${s_id_error_msg}{
        position: absolute;
        width: 100%;
        top: 0;
        background: #f5c0c099;
        color: #5e0505;
        padding: 1rem;
        z-index: 111;
    }
    .no-drag {
        -webkit-user-drag: none;
        user-drag: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    ${s_css_a_o_toast}
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    .inputs{
        position:fixed;
        z-index: 100;
        flex: 1 1 auto;
        top: 0;
        right: 0;
        width: 20%;
        max-width: 20%;
        height: 100%;
        background: rgba(22,22,22,0.8);
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
    .imgcont{
        flex: 1 1 auto;
        border: 1px solid red;

    }
    .imgcont img {
        width: 100%;
        height: 100%;
    }
    label{
        width:100%;
        }
    .canvasses{
        width: 80%;
    }
    .overlay{
        position: fixed;
        top:0;
        left:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        z-index: 100;
        padding: 1rem;
        box-sizing: border-box;
        backdrop-filter: blur(5px);
        border-radius: 1rem;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
        text-align: center;
        z-index: 100;           
    }
    .overlay div{

        flex: 1; /* Makes items grow equally to fill space */
        min-height: 100px; /* Sets minimum height */
        min-width: 100px; /* Sets minimum width */
        background-color: #3498db; /* Your desired background color */
        border: 1px solid #2980b9; /* Optional border for better visibility */


    }
    .item.active{
        outline: 2px solid green;
    }
    `
);

let f_o_item = function(
    s_text = '', 
    s_src_img = '',
    s_scl = 1,
    n_trn_x = 0, 
    n_trn_y = 0, 
    s_font_family = 'Arial', 
    s_color_bg = 'transparent', 
    s_color_font = 'red', 
    s_color_outline = 'black', 
    n_size_pixel_outline = 20, 
    n_scl_x_px_image = 0,
    n_scl_y_px_image = 0,
    n_scl_factor = 1,
){
    return { 
        s_text,
        s_src_img,
        s_scl,
        n_trn_x,
        n_trn_y,
        s_font_family,
        s_color_bg,
        s_color_font,
        s_color_outline,
        n_size_pixel_outline,
        n_scl_x_px_image,
        n_scl_y_px_image,
        n_scl_factor
    }
}

let f_callback_beforevaluechange = function(a_s_path, v_old, v_new){
    // console.log('a_s_path')
    // console.log(a_s_path)
    // let s_path = a_s_path.join('.');
    // if(s_path == 'a_o_person.0.s_name'){
    //     console.log('name of first person will be changed')
    // }
}
let f_callback_aftervaluechange = function(a_s_path, v_old, v_new){
    // console.log('a_s_path')
    // console.log(a_s_path)
    // let s_path = a_s_path.join('.');
    // if(s_path == 'n_thickness'){
    //     f_update_rendering();
    // }
}


let o_div = document;
let o_blob_stl = null;
let a_o_license = await(await fetch('https://api.sketchfab.com/v3/licenses')).json()
let a_o_category = await(await(fetch('https://api.sketchfab.com/v3/categories'))).json()
let a_o_pixel_black= []; // we dont need a proxy of this large array
let f_o_aspect_ratio = function(
    s_ratio = '4/3',
    s_description = 'Makerworld Desktop'
){
    return {
        s_ratio, 
        s_description
    }
}
let a_o_aspect_ratio =[
    f_o_aspect_ratio(
        '4/3', 'Makerworld Desktop',
    ),
    f_o_aspect_ratio(
        '3/4', 'Makerworld Mobile',
    ),
    f_o_aspect_ratio(
        '1/1', 'Square',
    )
]
let o_bcr_bgimg = {width:0};

let a_n_u8_imagedata_overlay = new Uint8ClampedArray(0); // we dont need a proxy of this large array
let a_n_u8_imagedata = new Uint8ClampedArray(0); // we dont need a proxy of this large array
let a_n_u8_imagedata_original = null;
let o_imagedata_original = null;

let a_n_y_to_take_from = new Uint8ClampedArray(0); // we dont need a proxy of this large array
let a_n_y_to_start_coloring = new Uint8ClampedArray(0); // we dont need a proxy of this large array


let o_state = f_o_proxified_and_add_listeners(
    {
        b_lock_take_from_and_start_coloring: false,
        b_take_from: true, 
        b_start_coloring: false, 
        n_ms_timeout: 333,
        n_id_timeout: 0,
        s_src_img: '',
        n_scl_x_px_image: 0,
        n_scl_y_px_image: 0,
        ...o_state_a_o_toast, 
        b_mouse_down_left: false,
        b_mouse_down_middle: false,
        b_mouse_down_right: false,
        n_scl_y: 0,
    },
    f_callback_beforevaluechange,
    f_callback_aftervaluechange, 
    o_div
)

globalThis.o_state = o_state

let f_sleep_ms = async function(n_ms){
    return new Promise((f_res, f_rej)=>{
        setTimeout(()=>{
            return f_res(true)
        },n_ms)
    })
}

let f_add_tag = function(){
    if(o_state.s_tag != '' && !o_state.a_s_tag.find(s=>{return s == o_state.s_tag})){
        o_state.a_s_tag.push(o_state.s_tag)
        o_state.s_tag = ''
    }
}


globalThis.f_o_toast = f_o_toast
let o_el_svg = null;
// then we build the html
f_o_toast('this is info', 'info', 5000)
f_o_toast('this is warning','warning', 5000)
f_o_toast('this is error','error', 5000)
f_o_toast('this will take a while','loading', 5000)


let f_n_idx_pixel_from_n_x_n_y = function(
    n_x, 
    n_y, 
    n_scl_x_px_image = o_state.n_scl_x_px_image, 
    n_scl_y_px_image = o_state.n_scl_y_px_image,
    n_channels = 4 // RGBA
){
    return (n_x + n_y * n_scl_x_px_image) * n_channels;
}
let f_update_canvas = function(){
    clearTimeout(o_state.n_id_timeout);
    o_state.n_id_timeout = setTimeout(()=>{
        f_update_canvas_timeout();
    }, o_state.n_ms_timeout);
}
let f_resize_canvas = function(){
    let o_canvas = document.querySelector('canvas#image');
    let o_canvas2 = document.querySelector('canvas#overlay');
    let o_ctx = o_canvas.getContext('2d');
    o_state.n_scl_y_px_image = o_state.n_scl_y;
    if(o_canvas && o_canvas2){
        o_canvas.height = o_state.n_scl_y_px_image;
        o_canvas2.height = o_state.n_scl_y_px_image;
    }
    o_ctx.putImageData(o_imagedata_original, 0, 0);
}
let f_update_canvas_timeout = function(
){
    

    let o_canvas = document.querySelector('canvas#image');
    let o_ctx = o_canvas.getContext('2d');
    let o_canvas2 = document.querySelector('canvas#overlay');
    let o_ctx2 = o_canvas2.getContext('2d');

    document.querySelector('.canvasses').style.width = `${o_canvas.width}px`;
    document.querySelector('.canvasses').style.height = `${o_canvas.height}px`;

    o_ctx.putImageData(o_imagedata_original, 0, 0);

    a_n_u8_imagedata = o_ctx.getImageData(0, 0, o_canvas.width, o_canvas.height).data;
    a_n_u8_imagedata_original = o_ctx.getImageData(0, 0, o_canvas.width, o_canvas.height).data;
    a_n_u8_imagedata_overlay = new Uint8ClampedArray(a_n_u8_imagedata.length);


    console.log('f_update_canvas_timeout')
    let n_channels = 4; // RGBA

    // client.module.js:275 Uncaught TypeError: Method %TypedArray%.prototype.slice called on incompatible receiver [object Uint8ClampedArray]
    // at Proxy.slice (<anonymous>)
    // at HTMLCanvasElement.onmousedown (client.module.js:275:88)
    // at HTMLCanvasElement.f_event_handler (module.js:2736:18)
    // fix the error by using the correct method to get the pixel data

    let n_y_take_from_last = 0;
    let n_y_to_start_coloring_last = 0;
    for(let n_x2 = 0; n_x2 < a_n_y_to_start_coloring.length; n_x2++){
        let n_y_take_from = a_n_y_to_take_from[n_x2];
        if(n_y_take_from == -1){
            n_y_take_from = n_y_take_from_last
        }
        n_y_take_from_last = n_y_take_from;
        let n_y_to_start_coloring = a_n_y_to_start_coloring[n_x2];
        if(n_y_to_start_coloring == -1){
            n_y_to_start_coloring = n_y_take_from
        }
        let n_idx1 = f_n_idx_pixel_from_n_x_n_y(n_x2, n_y_take_from, o_state.n_scl_x_px_image, o_state.n_scl_y_px_image, n_channels);
    
        let a_n_u8_imagedata_pixel = new Uint8ClampedArray(n_channels);
        a_n_u8_imagedata_pixel[0] = a_n_u8_imagedata_original[n_idx1]; // R
        a_n_u8_imagedata_pixel[1] = a_n_u8_imagedata_original[n_idx1+1]; // G
        a_n_u8_imagedata_pixel[2] = a_n_u8_imagedata_original[n_idx1+2]; // B            
        a_n_u8_imagedata_pixel[3] = a_n_u8_imagedata_original[n_idx1+3]; // A

        if(n_y_take_from != -1){
            let n_idx_pixel = f_n_idx_pixel_from_n_x_n_y(
                n_x2, n_y_take_from, o_state.n_scl_x_px_image, o_state.n_scl_y_px_image, n_channels);
                a_n_u8_imagedata_overlay[n_idx_pixel] = 0; // R
                a_n_u8_imagedata_overlay[n_idx_pixel+1] = 255
                a_n_u8_imagedata_overlay[n_idx_pixel+2] = 0//a_n_u8_imagedata_pixel[2]; // B
                a_n_u8_imagedata_overlay[n_idx_pixel+3] = 255//a_n_u8_imagedata_pixel[3]; // A
        }

        if(n_y_to_start_coloring != -1){
            for(let n_y2= n_y_to_start_coloring; n_y2 < o_state.n_scl_y; n_y2++){
                // console.log('n_x2', n_x2, 'n_y2', n_y2)
                let n_idx_pixel = f_n_idx_pixel_from_n_x_n_y(
                    n_x2, n_y2, o_state.n_scl_x_px_image, o_state.n_scl_y, n_channels);
                a_n_u8_imagedata[n_idx_pixel] = a_n_u8_imagedata_pixel[0]; // R
                a_n_u8_imagedata[n_idx_pixel+1] = a_n_u8_imagedata_pixel[1]; // G
                a_n_u8_imagedata[n_idx_pixel+2] = a_n_u8_imagedata_pixel[2]; // B
                a_n_u8_imagedata[n_idx_pixel+3] = a_n_u8_imagedata_pixel[3]; // A
                if(n_y2 ==n_y_to_start_coloring){
                    a_n_u8_imagedata_overlay[n_idx_pixel] = 255; // R
                    a_n_u8_imagedata_overlay[n_idx_pixel+1] = 0
                    a_n_u8_imagedata_overlay[n_idx_pixel+2] = 0//a_n_u8_imagedata_overlay_pixel[2]; // B
                    a_n_u8_imagedata_overlay[n_idx_pixel+3] = 255//a_n_u8_imagedata_pixel[3]; // A
                }
            }
        }


    }

    //draw a_n_u8_imagedata to canvas 
    o_ctx.clearRect(0, 0, o_canvas.width, o_canvas.height);

    let o_image_data = new ImageData(
        a_n_u8_imagedata, 
        o_state.n_scl_x_px_image, 
        o_state.n_scl_y_px_image
    );
    o_ctx.putImageData(o_image_data, 0, 0);

    // clear the canvas
    o_ctx2.clearRect(0, 0, o_canvas2.width, o_canvas2.height);
    let o_image_data_overlay = new ImageData(
        a_n_u8_imagedata_overlay, 
        o_state.n_scl_x_px_image, 
        o_state.n_scl_y_px_image
    );
    o_ctx2.putImageData(o_image_data_overlay, 0, 0);


    // f_o_toast('drawn pixel from image', 'info', 5000);
    // relative translation to the canvas element
}

let o = await f_o_html_from_o_js(
    {
        f_a_o: ()=>{
            return [
                {
                    class: "canvasses",
                    style: 'position:relative',
                    f_a_o:()=>{
                        return [
                            {
                                style: 'position: absolute; top: 0; left: 0; z-index:1',
                                s_tag: 'canvas',
                                id: 'overlay', 
                                onmousedown: (event)=>{
                                    if(event.button == 0){o_state.b_mouse_down_left = true;}
                                    if(event.button == 1){o_state.b_mouse_down_middle = true;}
                                    if(event.button == 2){o_state.b_mouse_down_right = true;}
                                },
                                onmousemove: function(o_event){
                                    if(o_state.b_mouse_down_left){
                                        let o_el = o_event.target;
                                        let o_rect = o_el.getBoundingClientRect();
                                        let o_trn_rel_to_el = {
                                            n_x: parseInt(o_event.clientX - o_rect.left),
                                            n_y: parseInt(o_event.clientY - o_rect.top)
                                        };
                                        // console.log(o_trn_rel_to_el)
                                        if(o_state.b_start_coloring){
                                            a_n_y_to_start_coloring[o_trn_rel_to_el.n_x] = o_trn_rel_to_el.n_y;
                                        }
                                        if(o_state.b_take_from){
                                            a_n_y_to_take_from[o_trn_rel_to_el.n_x] = o_trn_rel_to_el.n_y;
                                        }
                                        f_update_canvas();
                                    }
                                },
                            },
                            {
                                style: 'position: absolute; top: 0; left: 0;',
                                id: 'image', 
                                s_tag: "canvas",
                            },
                        ]
                    }
                },
                {
                    class: "inputs", 
                    f_a_o: ()=>{
                        return [
                            {
                                s_tag: "button", 
                                a_s_prop_sync: ['b_take_from','b_start_coloring', 'b_lock_take_from_and_start_coloring'],
                                f_s_innerText: ()=>{
                                    return o_state.b_lock_take_from_and_start_coloring ? 'synced' : 'not synced';
                                },
                                onclick: ()=>{
                                    o_state.b_lock_take_from_and_start_coloring = !o_state.b_lock_take_from_and_start_coloring;
                                    if(o_state.b_lock_take_from_and_start_coloring){
                                        o_state.b_start_coloring = true;
                                        o_state.b_take_from = true;
                                    }else{
                                        o_state.b_start_coloring = false;
                                        o_state.b_take_from = false;
                                    }
                                }
                            },
                            {
                                s_tag: "button", 
                                a_s_prop_sync: ['b_take_from','b_start_coloring', 'b_lock_take_from_and_start_coloring'],
                                f_s_innerText: ()=>{
                                    return `${(o_state.b_start_coloring) ? '[x]' : '[ ]'} start coloring`;
                                },
                                onclick: ()=>{
                                    if(o_state.b_lock_take_from_and_start_coloring){
                                        o_state.b_start_coloring = true;
                                        o_state.b_take_from = true;
                                    }
                                    else{
                                        o_state.b_start_coloring = true;
                                        o_state.b_take_from = false;
                                    }
                                }
                            },
                            {
                                s_tag: "button", 
                                a_s_prop_sync: ['b_take_from','b_start_coloring', 'b_lock_take_from_and_start_coloring'],
                                f_s_innerText: ()=>{
                                    return `${(o_state.b_take_from) ? '[x]' : '[ ]'} take from`;
                                },
                                onclick: ()=>{
                                    if(o_state.b_lock_take_from_and_start_coloring){
                                        o_state.b_start_coloring = true;
                                        o_state.b_take_from = true;
                                    }
                                    else{
                                        o_state.b_start_coloring = false;
                                        o_state.b_take_from = true;
                                    }
                                }
                            },
                            {
                                s_tag: "input",
                                type: 'file',
                                accept: 'image/*',
                                onchange: async function(o_event){
                                    let o_file = o_event.target.files[0];
                                    if(o_file){
                                        let o_reader = new FileReader();
                                        o_reader.onload = function(e) {
            
                                            let s_dataurl_image = e.target.result;
                                            o_state.s_src_img = s_dataurl_image;
                                            
                                            let o_img = new Image();
                                            o_img.onload = function() {
                                                o_state.n_scl_x_px_image = o_img.width;
                                                o_state.n_scl_y_px_image = o_img.height;
                                                o_state.b_loading_image = false;
                                                // draw image to canvas 
                                                let o_canvas = document.querySelector('canvas#image');
                                                o_canvas.width = o_img.width;
                                                o_canvas.height = o_img.height;
                                                let o_canvas_overlay = document.querySelector('canvas#overlay');
                                                o_canvas_overlay.width = o_img.width;
                                                o_canvas_overlay.height = o_img.height;
            
                                                let o_ctx = o_canvas.getContext('2d');
                                                o_ctx.clearRect(0, 0, o_canvas.width, o_canvas.height);
                                                o_ctx.drawImage(o_img, 0, 0, o_img.width, o_img.height);
                                                //downscale the image to max 1000px width 
                                                if(o_img.width > 1000){
                                                    let n_scl_factor = 1000 / o_img.width;
                                                    o_state.n_scl_x_px_image = 1000;
                                                    o_state.n_scl_y_px_image = o_img.height * n_scl_factor;
                                                    o_canvas.width = o_state.n_scl_x_px_image;
                                                    o_canvas.height = o_state.n_scl_y_px_image;
                                                    o_canvas_overlay.width = o_state.n_scl_x_px_image;
                                                    o_canvas_overlay.height = o_state.n_scl_y_px_image;
                                                    
            
                                                    o_ctx.drawImage(o_img, 0, 0, o_state.n_scl_x_px_image, o_state.n_scl_y_px_image);
                                                }
                                                o_state.n_scl_y = o_canvas.height;

                                                o_imagedata_original = o_ctx.getImageData(0, 0, o_canvas.width, o_canvas.height);
                                                a_n_u8_imagedata = o_ctx.getImageData(0, 0, o_canvas.width, o_canvas.height).data;
                                                a_n_u8_imagedata_original = o_ctx.getImageData(0, 0, o_canvas.width, o_canvas.height).data;
                                                a_n_u8_imagedata_overlay = new Uint8ClampedArray(a_n_u8_imagedata_original.length);
                                                a_n_y_to_take_from = new Array(o_canvas.width).fill(-1);
                                                a_n_y_to_start_coloring = new Array(o_canvas.width).fill(-1);
            
                                                globalThis.a_n_y_to_take_from = a_n_y_to_take_from
                                                globalThis.a_n_y_to_start_coloring = a_n_y_to_start_coloring
                                            };
                                            o_img.src = s_dataurl_image;
                                            // o_state.b_loading_image = true
                                        };
                                        o_reader.readAsDataURL(o_file);
                                    }
                                }
                            }, 
                            {
                                s_tag: "button", 
                                f_s_innerText: ()=>{
                                    return `download image`;
                                },
                                onclick: ()=>{
                                    //download image from o_ctx 1
                                    let o_canvas = document.querySelector('canvas#image');
                                    let o_link = document.createElement('a');
                                    o_link.href = o_canvas.toDataURL('image/png');
                                    o_link.download = 'image.png';
                                    o_link.click(); 
                                }
                            },
                            {
                                s_tag: "input", 
                                a_s_prop_sync: ['n_scl_y'],
                                onchange: ()=>{
                                    //download image from o_ctx 1
                                    let o_canvas = document.querySelector('canvas#image');
                                    f_resize_canvas();
                                }
                            },
                        ]
                    }
                },
            ]
        }
    }, 
    o_state
)

window.onmouseup = function(o_event){
    if(o_event.button == 0){o_state.b_mouse_down_left = false;} 
    if(o_event.button == 1){o_state.b_mouse_down_middle = false;} 
    if(o_event.button == 2){o_state.b_mouse_down_right = false;} 
}
document.body.appendChild(o);
