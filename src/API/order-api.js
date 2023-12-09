import { instance } from "./api";

export const orderAPI = {
    async orders(
        PageNumber = 1,
        PageSize = 10,
        Sort,
        StartDate,
        EndDate,
        Status,
        EmployeeFirstName,
        WorksTypeName
    ) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        if (StartDate !== "") params.StartDate = StartDate;
        if (EndDate !== "") params.EndDate = EndDate;
        if (Status !== "") params.Status = Status;
        if (EmployeeFirstName !== "") params.EmployeeFirstName = EmployeeFirstName;
        if (WorksTypeName !== "") params.WorksTypeName = WorksTypeName;
        if (Sort !== "") params.Sort = Sort;
        const res = await instance.get(`orders`, {
            params: params,
        });
        return res.data;
    },
    async createOrder(res_order, res_materials) {
        const res = await instance.post(`orders`, {
            res_order: res_order,
            res_materials: res_materials,
        });
        return res.data;
    },
    async updateOrder(id, res_order) {
        const res = await instance.put(`orders/` + id, {
            orderId: parseInt(id),
            receivingDate: res_order.receivingDate,
            issueDate: res_order.issueDate,
            status: res_order.status,
            workTypeId: res_order.workTypeId,
            employeeId: res_order.employeeId,
            clientId: res_order.clientId,
        });
        return res.data;
    },
    async order(id) {
        const res = await instance.get(`orders/` + id);
        return res.data;
    },
    async orderMaterials(id) {
        const res = await instance.get(`orders/` + id + `/materials`);
        return res.data;
    },
    async deleteOrderMaterial(o_id, m_id) {
        const res = await instance.delete(`orders/` + o_id + `/materials/` + m_id);
        return res.data;
    },
    async createOrderMaterial(o_id, material) {
        const res = await instance.post(`orders/` + o_id + `/materials`, {
            orderId: parseInt(o_id),
            materialId: material.materialId,
            count: material.count,
        });
        return res.data;
    },
    async ordersExportData() {
        const res = await instance.get(`orders/exportData`, "responseType: 'blob'");
        return res.data;
    },
    async getMinMaxYear() {
        const res = await instance.get(`orders/years`);
        return res.data;
    },
    async getStatisticalData(year) {
        const res = await instance.get(`orders/statisticalData/` + year);
        return res.data;
    },
};