"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = exports.Organization = exports.BillingDetails = exports.Address = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Address = class Address {
};
exports.Address = Address;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Address.prototype, "line1", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Address.prototype, "line2", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Address.prototype, "pincode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
exports.Address = Address = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Address);
const AddressSchema = mongoose_1.SchemaFactory.createForClass(Address);
let BillingDetails = class BillingDetails {
};
exports.BillingDetails = BillingDetails;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingDetails.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingDetails.prototype, "billingEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], BillingDetails.prototype, "billingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingDetails.prototype, "notes", void 0);
exports.BillingDetails = BillingDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BillingDetails);
const BillingDetailsSchema = mongoose_1.SchemaFactory.createForClass(BillingDetails);
let Organization = class Organization {
};
exports.Organization = Organization;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Organization.prototype, "gstNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AddressSchema }),
    __metadata("design:type", Address)
], Organization.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Organization.prototype, "contactPersonName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Organization.prototype, "contactPersonNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BillingDetailsSchema }),
    __metadata("design:type", BillingDetails)
], Organization.prototype, "billingDetails", void 0);
exports.Organization = Organization = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Organization);
exports.OrganizationSchema = mongoose_1.SchemaFactory.createForClass(Organization);
//# sourceMappingURL=organization.schema.js.map