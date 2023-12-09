import { instance } from "./api";

export const employeeAPI = {
    async employees(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`employees`, {
            params: params,
        });
        return res.data;
    },
    async createEmployee(data) {
        const res = await instance.post(`employees`, {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            login: data.login,
            password: data.password,
        });
        return res.data;
    },
    async deleteEmployee(id) {
        const res = await instance.delete(`employees/` + id);
        return res.data;
    },
    async employeeFirstNames() {
        const res = await instance.get(`employees/firstNames`);
        return res.data;
    },
    async employeesSelectData() {
        const res = await instance.get(`employees/selectData`);
        return res.data;
    },
};