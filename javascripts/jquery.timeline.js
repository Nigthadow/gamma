
(function($){
    var n = 'timeline';
    $.fn[n] = function(opts){
        if (typeof (opts) === "string") {
            var args = new Array();
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return $[n].funcs[opts].apply(this, args);
        }
        if(!this.hasClass($[n].clss.tl)){
            var options = {};
            $.extend(options, $[n].opts, opts);
            this.addClass($[n].clss.tl)
                .data('opts', options);
            $[n].funcs.mkNodes.apply(this);
        }
        return this;
    }
    $[n] = {
        clss: {
            tl: 'tl',
            node: 'tl-node',
            nodeNotTop: 'tl-node-nottop',
            point: 'tl-point',
            info: 'tl-node-info',
            infoRight: 'tl-info-right',
            infoLeft: 'tl-info-left',
            arrow: 'tl-info-arrow',
            arrowRight: 'tl-arrow-right',
            arrowLeft: 'tl-arrow-left',
            infoWrapper: 'tl-info-wrapper',
            wrapLeft: 'tl-wrapper-left',
            wrapRight: 'tl-wrapper-right',
            infoTitle: 'tl-info-title',
            infoContent: 'tl-info-content'
        },
        opts: {
            nodes: [
                {
                    title: '<p>Node Title.</p>',
                    content: '<p>Node content.</p>'
                }
            ]
        },
        funcs: {
            mkNodes: function(){
                var nodes = this.data('opts').nodes;
                for(var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
                    var cNotTop = (i === 0)?(''):($[n].clss.nodeNotTop);
                    var cInfoPos = (i % 2 === 0)?($[n].clss.infoLeft):($[n].clss.infoRight);
                    var cArrPos = (i % 2 === 0)?($[n].clss.arrowRight):($[n].clss.arrowLeft);
                    var cWrapper = (i % 2 === 0)?($[n].clss.wrapLeft):($[n].clss.wrapRight);
                    var tokens = ['<div class="', $[n].clss.node, ' ', cNotTop, '">'
                                    , '<div class="', $[n].clss.point, '"></div>'
                                    , '<div class="', $[n].clss.info, ' ', cInfoPos, '">'
                                        , '<div class="', $[n].clss.arrow, ' ', cArrPos, '"></div>'
                                        , '<div class="', $[n].clss.infoWrapper, ' ', cWrapper, '">'
                                            , '<div class="', $[n].clss.infoTitle, '">', node.title, '</div>',
                                            , '<div class="', $[n].clss.infoContent, '">', node.content, '</div>',
                                        , '</div>'
                                    , '</div>'
                                , '</div>'];
                    var $node = $(tokens.join(''));
                    this.append($node);
                }
            }
        }
    };
})(jQuery);