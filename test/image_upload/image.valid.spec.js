/**
 * 图片类型和大小验证
 */

var Upload = require( '../../image_upload/' );

// 设置最大图片尺寸为1M
var M = 1024 * 1024;
var MAX_SIZE = 1 * M;

// 格式和大小都符合的图片
var SIZE_FORMAT_PATH = __dirname + '/images/size_format.bmp';
// 格式不符合大小符合
var SIZE_NO_FORMAT_PATH = __dirname + '/images/size_no_format.pdf';
// 格式符合大小不符合
var NO_SIZE_FORMAT_PATH = __dirname + '/images/no_size_format.jpg';
// 格式和大小都不符合
var NO_SIZE_NO_FORMAT_PATH = __dirname + '/images/no_size_no_format.pdf';

Upload.setMaxSize( MAX_SIZE );

describe( '图片类型和大小验证', function(){

    it( '格式和大小都符合的图片', function(){

        var v;
        var t;
        var e;

        runs(function(){
            Upload.check( SIZE_FORMAT_PATH, function( err, valid, type ){
                e = err;
                v = valid;
                t = type;
            });
        });

        waitsFor( function(){

            return v === false || v === true;
        });

        runs( function(){

            expect( typeof e ).toEqual( 'undefined' );
            expect( v ).toEqual( true );
            expect( t ).toEqual( 'bmp' );
        });
    });

    it( '格式不符合大小符合', function(){

        var v;
        var t;
        var e;

        runs(function(){
            Upload.check( SIZE_NO_FORMAT_PATH, function( err, valid, type ){
                e = err;
                v = valid;
                t = type;
            });
        });

        waitsFor( function(){

            return v === false || v === true;
        });

        runs( function(){

            expect( typeof e ).toEqual( 'undefined' );
            expect( v ).toEqual( false );
            expect( t ).toEqual( '非法的图片格式' );
        });
    });

    it( '格式符合大小不符合', function(){

        var v;
        var t;
        var e;

        runs(function(){
            Upload.check( NO_SIZE_FORMAT_PATH, function( err, valid, type ){
                e = err;
                v = valid;
                t = type;
            });
        });

        waitsFor( function(){

            return v === false || v === true;
        });

        runs( function(){

            expect( typeof e ).toEqual( 'undefined' );
            expect( v ).toEqual( false );
            expect( t ).toEqual( '非法的图片文件大小' );
        });
    });

    it( '格式和大小都不符合', function(){

        var v;
        var t;
        var e;

        runs(function(){
            Upload.check( NO_SIZE_NO_FORMAT_PATH, function( err, valid, type ){
                e = err;
                v = valid;
                t = type;
            });
        });

        waitsFor( function(){

            return v === false || v === true;
        });

        runs( function(){

            expect( typeof e ).toEqual( 'undefined' );
            expect( v ).toEqual( false );
            expect( t ).toEqual( '非法的图片格式' );
        });
    });
});