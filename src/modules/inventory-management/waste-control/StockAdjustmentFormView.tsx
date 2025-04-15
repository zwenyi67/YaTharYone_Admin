import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { t } from 'i18next';
import { useDispatch } from 'react-redux';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';
import FormHeader from '@/components/common/FormHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddStockAdjustmentPayloadType, GetItemCategoriesType, UpdateStockAdjustmentPayloadType } from '@/api/inventory/types';
import { GetItemType } from '@/api/purchase-item/types';
import DatePicker from '@/components/ui/datepicker';
import { format } from "date-fns";


const formSchema = z.object({
  item_category_id: z.string().min(1, {
    message: "Item Category is required.",
  }),
  item_id: z.string().min(1, {
    message: "Item is required.",
  }),
  reason: z.string().optional(),
  adjustment_type: z.string().min(1, {
    message: "Adjustment Type is required.",
  }),
  adjustment_date: z.date({
    required_error: "Adjustment date is required.",
  }),
  quantity: z.union([
    z.string(),
    z.number()
  ])
    .transform((value) => {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
      }
      return value;
    })
    .refine((value) => {
      return typeof value === 'number' && value >= 1;
    }, { message: "Quantity must be greater than 0." }),
  createby: z.number().optional(), // Assuming this is optional for the form
});

export default function StockAdjustmentFormView() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();
  const { id } = useParams();

  const passedData = location.state?.data;

  const item: AddStockAdjustmentPayloadType = id
    ? { ...passedData }
    : {
      item_id: "",
      quantity: 0,
      adjustment_type: "",
      reason: "",
      adjustment_date: null,
      createby: 1,
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_id: item?.item_id.toString() || "",
      quantity: item?.quantity || 0,
      adjustment_type: item?.adjustment_type || "",
      adjustment_date: item?.adjustment_date ? new Date(item.adjustment_date) : undefined,
      reason: item?.reason || "",
      createby: item?.createby || 1,
    },
  });
  const unit = useWatch({
    control: form.control,
    name: "item_id"
  })
  const unitOnly = unit ? unit.split(',')[2]?.trim() : '';

  const { data: cates, isFetching: isCateFetching } = api.inventory.getItemCategories.useQuery();

  const itemCategoryId = useWatch({
    control: form.control,
    name: "item_category_id", // Field to watch
  });

  const { data: items, isFetching: isItemFetching } = api.purchaseItem.getItems.useQuery(itemCategoryId);

  const { mutate: addStockAdjustment } =
    api.inventory.addStockAdjustment.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "New Item added successfully",
          variant: "success",
        });
        navigate("/inventory-management/stock-adjustment");
      },
      onError: (error) => {
        form.setError("quantity", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const { mutate: updateStockAdjustment } =
    api.inventory.updateStockAdjustment.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "Item updated successfully",
          variant: "success",
        });
        navigate("/inventory-management/stock-adjustment");
      },
      onError: (error) => {
        form.setError("quantity", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });


  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    try {
      // Format dates and create FormData
      const formData = new FormData();
      formData.append("quantity", item.quantity.toString());
      formData.append("adjustment_type", item.adjustment_type || '');
      formData.append("adjustment_date", format(item.adjustment_date, "yyyy-MM-dd"));
      formData.append("reason", item.reason || '');
      formData.append("item_id", item.item_id || '');

      if (id) {
        // For edit form
        formData.append("updateby", (item.createby || 1).toString());
        formData.append("id", id);

        // Call update API
        await updateStockAdjustment(formData as unknown as UpdateStockAdjustmentPayloadType);
      } else {
        // For add form
        formData.append("createby", (item.createby || 1).toString());

        // Call add API
        await addStockAdjustment(formData as unknown as AddStockAdjustmentPayloadType);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="m-4">
      <FormHeader
        title={t("title.stock-adjustment")}
      />
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/inventory-management/waste-control'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            {id ? "Edit Stock Adjustment" : "Add New Stock Adjustment"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-7 gap-6 mt-5'>
              {/*Item Category */}
              <div className='col-span-3'>
                <FormField
                  control={form.control}
                  name="item_category_id"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Item Category <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isCateFetching ? 'Loading' : 'Select Category'} />
                          </SelectTrigger>
                          <SelectContent>
                            {cates?.map((cate: GetItemCategoriesType) => (
                              <SelectItem key={cate.id} value={cate.id.toString()}>{cate.name}</SelectItem>
                            ))}

                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Item Name */}
              <div className='col-span-3'>
                <FormField
                  control={form.control}
                  name="item_id"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Item Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select disabled={!itemCategoryId} value={field.value}
                          onValueChange={(value) => field.onChange(value)} defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isItemFetching ? 'Loading' : 'Select Item'} />
                          </SelectTrigger>
                          <SelectContent>
                            {items?.map((item: GetItemType) => (
                              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Unit of Measure */}
              <div>
                <div className="">
                  <FormLabel>Unit</FormLabel>
                  <Input disabled placeholder={unitOnly} />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-6 gap-6 mt-5'>
              {/* Quantity */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Quantity <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Adjustment Type */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="adjustment_type"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Adjustment Type <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Update form state
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spoiled">Spoiled</SelectItem>
                            <SelectItem value="waste">Waste</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2'>
                {/* Adjustment Date */}
              <FormField
                control={form.control}
                name="adjustment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Date <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-6 mt-5'>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-7">
                {id ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </section >
  )
}
