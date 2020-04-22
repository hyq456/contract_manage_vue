
import store from '../../store'

const user = {
    state:{
        id:sessionStorage.getItem(`id`)||"",
        username:sessionStorage.getItem(`username`)||"name",
        // password:"",
        email:sessionStorage.getItem(`email`)||"",
        department:sessionStorage.getItem(`department`)||"",
        tel:sessionStorage.getItem(`tel`)||"",
        role:sessionStorage.getItem(`role`)||"",
        taken:"",
        realname:sessionStorage.getItem(`realname`)||"",
    },
    mutations:{
        set_user(state,userInfo)
        {
            state.id = userInfo.id;
            sessionStorage.setItem(`id`,userInfo.id);
            state.username = userInfo.username;
            sessionStorage.setItem(`username`,userInfo.username);
            // state.password = userInfo.password;
            state.email = userInfo.email;
            sessionStorage.setItem(`email`,userInfo.email);
            state.department = userInfo.department;
            sessionStorage.setItem(`department`,userInfo.department);
            state.tel = userInfo.tel;
            sessionStorage.setItem(`tel`,userInfo.tel);
            state.role = userInfo.role;
            sessionStorage.setItem(`role`,userInfo.role);
            state.realname = userInfo.realname;
            sessionStorage.setItem(`realname`,userInfo.realname);
        },
        set_taken(state,taken)
        {
            state.taken = taken;
            sessionStorage.setItem(`taken`,taken);
        }
    },
    actions: {
       
    }
}

export default user