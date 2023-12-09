import { instance } from "./api";

export const materialAPI = {
    async materials(PageNumber = 1, PageSize = 10, Name, Sort) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        if (Name !== "") params.Name = Name;
        if (Sort !== "") params.Sort = Sort;
        const res = await instance.get(`materials`, {
            params: params,
        });
        return res.data;
    },
    async materialsNames() {
        const res = await instance.get(`materials/names`);
        return res.data;
    },
    async createMaterial(data) {
        const res = await instance.post(`materials`, {
            name: data.name,
            quantity: parseFloat(data.quantity),
            reserve: parseFloat(data.reserve),
            cost: parseFloat(data.cost),
        });
        return res.data;
    },
    async updateMaterial(id, data) {
        const res = await instance.put(`materials/` + id, {
            materialId: parseInt(id),
            name: data.name,
            quantity: parseFloat(data.quantity),
            reserve: parseFloat(data.reserve),
            cost: parseFloat(data.cost),
        });
        return res.data;
    },
    async material(id) {
        const res = await instance.get(`materials/` + id);
        return res.data;
    },
    async materialsSelectData() {
        const res = await instance.get(`materials/selectData`);
        return res.data;
    },
    async materialsExportData() {
        const res = await instance.get(`materials/exportData`, "responseType: 'blob'");
        return res.data;
    },
};