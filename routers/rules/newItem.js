var DB = require( '../../database/' );
var API = require( '../../api/api.js' );
var Auth = require( '../../auth/' );
var IMG = require( '../../image_handle' );

var newItem =  {
    type: 'post',
        rule: '/newItem',
        middleware: [ 'shouldLogin' ],
        fn: function ( req, res ){

        var newImg = new DB.image();
        var newItem = new DB.item();
        var body = req.body;
        var auth = new Auth();
        var userInfo = auth.getAuthInfo( req );

        var title = body.title;
        var desc = body.desc;
        var price = parseFloat( body.price ) || 0;
        var latlng = body.latlng;
        var address = body.address;
        var pics = [];

        var i, dataString, ifError = false, picCheckCount = 0;

        newImg.on( '_error', function( msg, error ){

            API.send( req, res, {
                result: false,
                type: 'newItem',
                error: msg,
                data: error
            });
        });

        newItem.on( '_error', function( msg, error ){

            API.send( req, res, {
                result: false,
                type: 'newItem',
                error: msg,
                data: error
            });
        });

        // 检查图片
        for( i = 1; i <= 3; i++ ){

            if( dataString = body[ 'pic' + i ] ){

                (function( index, ds ){

                    // 检查
                    IMG.base64Check( ds, function ( err, path, ifValid, imgInfo ){

                        // 若已经出现过错误，则后面的都不处理
                        if( ifError ){
                            return;
                        }

                        if( err ){

                            API.send( req, res, {
                                result: false,
                                type: 'newItem',
                                error: 'error when checking image!',
                                data: err
                            });

                            ifError = true;
                        }
                        else {

                            // 若验证通过
                            if( ifValid ){

                                // 图片的保存地址
                                var newPath = 'uploads/' + userInfo.id + '_' + path.substring( 5 ) + Date.now() + '.' + imgInfo.type;

                                // 图片另存为
                                IMG.saveAs( path, newPath, function ( err ){

                                    if( ifError ){

                                        return;
                                    }

                                    picCheckCount++;

                                    if( err ){

                                        API.send( req, res, {
                                            result: false,
                                            type: 'newItem',
                                            error: 'error when saving image!',
                                            data: err
                                        });

                                        ifError = true;

                                    }
                                    else {

                                        pics[ index ] = {
                                            path: newPath,
                                            type: imgInfo.type,
                                            mime: imgInfo.mimeType,
                                            size: imgInfo.size
                                        };

                                        if( picCheckCount === 3 ){

                                            console.log( 'before additem' );
                                            addItem();
                                        }
                                    }
                                });

                            }
                            else {

                                picCheckCount++;

                                if( picCheckCount === 3 ){

                                    console.log( 'before additem' );
                                    addItem();
                                }
                            }
                        }
                    });
                })( i, dataString );
            }
            else {

                picCheckCount++;

                if( picCheckCount === 3 ){

                    addItem();
                }
            }

        }

        // 添加新商品
        function addItem(){

            console.log( 'addItem' );

            var userId = userInfo.id;
            var count = 0;
            var i, pic;

            // 新建商品
            newItem.add( userId, {
                title: title,
                desc: desc,
                price: price,
                location: latlng.split( ',' ),
                address: address
            }, function ( newItem ){

                var itemId = newItem.id;

                if( count === pics.length ){

                    addItemSuccess( itemId );
                }
                else {

                    for( i = 0; i < pics.length; i++ ){

                        pic = pics[ i ];

                        if( pic ){
                            newImg.add( itemId, pic, function ( newImg ){

                                count++;

                                if( count === pics.length ){

                                    addItemSuccess( itemId );
                                }
                            });
                        }
                        else {

                            count++;

                            if( count === pics.length ){

                                addItemSuccess( itemId );
                            }
                        }
                    }
                }

            })

        }

        function addItemSuccess( itemId ){

            API.send( req, res, {
                result: true,
                type: 'newItem',
                data: {
                    itemId: itemId
                }
            });
        }
    }
};

exports.rule = newItem;