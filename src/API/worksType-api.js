import { instance } from "./api";

export const worksTypeAPI = {
    async worksTypes(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`worksTypes`, {
            params: params,
        });
        return res.data;
    },
    async createWorksType(data) {
        const res = await instance.post(`worksTypes`, {
            name: data.name,
            cost: parseFloat(data.cost),
        });
        return res.data;
    },
    async updateWorksType(id, data) {
        const res = await instance.put(`worksTypes/` + id, {
            worksTypeId: parseInt(id),
            name: data.name,
            cost: parseFloat(data.cost),
        });
        return res.data;
    },
    async worksType(id) {
        const res = await instance.get(`worksTypes/` + id);
        return res.data;
    },
    async worksTypeNames() {
        const res = await instance.get(`worksTypes/names`);
        return res.data;
    },
    async worksTypesSelectData() {
        const res = await instance.get(`worksTypes/selectData`);
        return res.data;
    },
};