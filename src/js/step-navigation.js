module.exports = function(){
    let Steps = require('./steps');

    let Builder = {
        data: [],
        get(name){
            return this.data.filter(function (instance) {
                return instance.name() == name;
            })[0];
        },
        all(){
            return this.data;
        },
        autoload(){
            $('[sb-wrapper]').not('[sb-autoload="false"]').not('[sb-initialized]').each(function (index, wrapper) {
                var $wrapper = $(wrapper);

                $wrapper.attr('sb-initialized', true);

                let name = $wrapper.attr('sb-wrapper');

                if(this.data.filter((instance) => {return instance.name == name})[0]){
                    throw `The wrapper with name ${name} is not unique`;
                }

                let instance = new Steps(name);

                this.data.push(instance);
            }.bind(this));
        },
        init(name, settings){
            let instance = new Steps(name, settings);

            this.data.push(instance);
        }
    };

    function getWrapperInstance(button){
        return Builder.get($(button).parents('[sb-wrapper]').first().attr('sb-wrapper'))
    }

    $('body')
        .on('click', '[sb-wrapper] [sb-next]', function () {
            getWrapperInstance(this).next();
        })
        .on('click', '[sb-wrapper] [sb-previous]', function(){
            getWrapperInstance(this).previous();
        })
        .on('click', '[sb-wrapper] [sb-restart]', function () {
            getWrapperInstance(this).restart();
        });

    Builder.autoload();

    return Builder;
}();

