function scheduleform(value) {

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("schedule").disabled = true;
        alert("test");
    });

    document.getElementById('schedule_type').onchange = function () {
        document.getElementById("schedule").disabled = this.value != 'advanced';
    };
}
