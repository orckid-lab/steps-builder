window.StepBuilder = require('./step-navigation');

StepBuilder.get('wrapper-1').configure({
    callbacks: {
        beforeLeaveStep4(instance){
            var $checkedRadio = instance.$step().find('input[type="radio"]:checked');

            if($checkedRadio.length == 0){
                alert ('Choose a pill!');
                return false;
            }

            if($checkedRadio.val() == 1){
                return 5;
            }

            if($checkedRadio.val() == 2){
                return 6;
            }
        }
    }
});

new Vue({
    el: '#app',
    data: {
        path_of_the_chosen_one: StepBuilder.get('wrapper-1'),
        pat_history: StepBuilder.get('wrapper-1').history(),
        pat_log: StepBuilder.get('wrapper-1').log(),
    }
});