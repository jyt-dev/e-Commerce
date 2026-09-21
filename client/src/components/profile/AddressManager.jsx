import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '@/features/shopping/addressThunk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SpinnerCustom } from '@/components/ui/spinner';
import { MapPin, Pencil, Trash2, Plus, X, Home, Star } from 'lucide-react';

const EMPTY_FORM = {
    house: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    phone: '',
    isDefault: false,
};

// Defined OUTSIDE AddressManager so it doesn't remount on every keystroke
function AddressForm({ formData, onChange, onSubmit, onCancel, isLoading, isEdit }) {
    return (
        <form onSubmit={onSubmit} className="border border-gray-200 bg-gray-50 p-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-700">
                    {isEdit ? 'Edit Address' : 'Add New Address'}
                </h4>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="house" className="text-xs font-medium text-gray-600">House / Flat / Building *</Label>
                    <Input id="house" name="house" required placeholder="e.g. 42B, Sunrise Apartments" value={formData.house} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="landmark" className="text-xs font-medium text-gray-600">Landmark *</Label>
                    <Input id="landmark" name="landmark" required placeholder="e.g. Near City Mall" value={formData.landmark} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="city" className="text-xs font-medium text-gray-600">City *</Label>
                    <Input id="city" name="city" required placeholder="City" value={formData.city} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="state" className="text-xs font-medium text-gray-600">State *</Label>
                    <Input id="state" name="state" required placeholder="State" value={formData.state} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="country" className="text-xs font-medium text-gray-600">Country *</Label>
                    <Input id="country" name="country" required placeholder="Country" value={formData.country} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="pin" className="text-xs font-medium text-gray-600">PIN Code *</Label>
                    <Input id="pin" name="pin" required placeholder="PIN / ZIP code" value={formData.pin} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-medium text-gray-600">Phone Number *</Label>
                    <Input id="phone" name="phone" required type="tel" placeholder="10-digit mobile number" value={formData.phone} onChange={onChange} className="rounded-none text-sm" />
                </div>

                <div className="flex items-center gap-2 self-end pb-1">
                    <input id="isDefault" name="isDefault" type="checkbox" checked={formData.isDefault} onChange={onChange} className="h-4 w-4 accent-blue-600" />
                    <Label htmlFor="isDefault" className="text-xs font-medium text-gray-600 cursor-pointer">Set as default address</Label>
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={isLoading} className="rounded-none text-sm">
                    {isLoading ? <SpinnerCustom className="h-4 w-4" /> : isEdit ? 'Update Address' : 'Save Address'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="rounded-none text-sm">Cancel</Button>
            </div>
        </form>
    );
}

export default function AddressManager() {
    const dispatch = useDispatch();
    const { addressList, isLoading } = useSelector(state => state.addresses);

    // null = hidden, 'add' = add mode, <id string> = edit mode
    const [formMode, setFormMode] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const openAdd = () => {
        setFormData(EMPTY_FORM);
        setFormMode('add');
    };

    const openEdit = (address) => {
        setFormData({
            house: address.house || '',
            landmark: address.landmark || '',
            city: address.city || '',
            state: address.state || '',
            country: address.country || '',
            pin: address.pin || '',
            phone: address.phone || '',
            isDefault: address.isDefault || false,
        });
        setFormMode(address._id);
    };

    const cancelForm = () => {
        setFormMode(null);
        setFormData(EMPTY_FORM);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === 'add') {
                await dispatch(addAddress(formData)).unwrap();
                toast.success("Address added successfully");
            } else {
                await dispatch(updateAddress({ addressId: formMode, formData })).unwrap();
                toast.success("Address updated successfully");
            }
            cancelForm();
        } catch (err) {
            toast.error(err?.message || "Failed to save address");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                toast.success("Address deleted");
            } catch (err) {
                toast.error(err?.message || "Failed to delete address");
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Manage Addresses</h3>
                {formMode === null && (
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-500 hover:border-blue-800 px-3 py-1.5 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Address
                    </button>
                )}
            </div>

            {/* Inline form for adding */}
            {formMode === 'add' && (
                <AddressForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={cancelForm}
                    isLoading={isLoading}
                    isEdit={false}
                />
            )}

            {/* Address list */}
            {isLoading && addressList.length === 0 ? (
                <div className="flex justify-center p-12"><SpinnerCustom /></div>
            ) : addressList.length === 0 && formMode !== 'add' ? (
                <div className="border border-dashed border-gray-300 p-10 text-center">
                    <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No saved addresses yet.</p>
                    <button onClick={openAdd} className="mt-3 text-sm text-blue-600 hover:underline">+ Add your first address</button>
                </div>
            ) : (
                <div className="space-y-3">
                    {addressList.map(address => (
                        <div key={address._id}>
                            {formMode === address._id ? (
                                <AddressForm
                                    formData={formData}
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                    onCancel={cancelForm}
                                    isLoading={isLoading}
                                    isEdit={true}
                                />
                            ) : (
                                <div className={`border p-4 ${address.isDefault ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <Home className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                            <div>
                                                {address.isDefault && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-1">
                                                        <Star className="h-3 w-3" /> Default
                                                    </span>
                                                )}
                                                <p className="text-sm font-medium text-gray-800">{address.house}</p>
                                                <p className="text-sm text-gray-600">{address.landmark}</p>
                                                <p className="text-sm text-gray-600">{address.city}, {address.state}, {address.country} — {address.pin}</p>
                                                <p className="text-sm text-gray-500 mt-1">📞 {address.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <button onClick={() => openEdit(address)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                <Pencil className="h-3 w-3" /> Edit
                                            </button>
                                            {!address.isDefault && (
                                                <button onClick={() => handleDelete(address._id)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                                    <Trash2 className="h-3 w-3" /> Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
