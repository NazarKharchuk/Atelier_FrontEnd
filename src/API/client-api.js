import { instance } from "./api";

export const clientAPI = {
    async clients(PageNumber = 1, PageSize = 10, FirstName, LastName, Sort) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        if (FirstName !== "") params.FirstName = FirstName;
        if (LastName !== "") params.LastName = LastName;
        if (Sort !== "") params.Sort = Sort;
        const res = await instance.get(`clients`, {
            params: params,
        });
        return res.data;
    },
    async clientsFirstNames() {
        const res = await instance.get(`clients/firstNames`);
        return res.data;
    },
    async clientsLastNames() {
        const res = await instance.get(`clients/lastNames`);
        return res.data;
    },
    async createClient(data) {
        const res = await instance.post(`clients`, {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            phoneNumber: data.phoneNumber,
            address: data.address,
        });
        return res.data;
    },
    async updateClient(id, data) {
        const res = await instance.put(`clients/` + id, {
            clientId: parseInt(id),
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            phoneNumber: data.phoneNumber,
            address: data.address,
        });
        return res.data;
    },
    async client(id) {
        const res = await instance.get(`clients/` + id);
        return res.data;
    },
    async clientsSelectData() {
        const res = await instance.get(`clients/selectData`);
        return res.data;
    },
};