import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Link, useParams } from 'react-router-dom';
import { CircleChevronLeft, PencilRuler } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetItemCategoriesType } from '@/api/inventory/types';
import { AddPurchaseItemPayloadType, ConfirmPurchaseItemsPayloadType, GetItemType } from '@/api/purchase-item/types';
import { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cross2Icon } from '@radix-ui/react-icons';
import { t } from "i18next"
import { useDispatch } from 'react-redux';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';
import UnitConverter from '@/components/common/UnitConverter';

const formSchema = z.object({
  item_category_id: z.string().min(1, {
    message: "Item Category is required.",
  }),
  item_id: z.string().min(1, {
    message: "Item is required.",
  }),
  total_cost: z.union([
    z.string(),
    z.number()
  ])
    .transform((value) => {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
      }
      return value; // No transformation for already a number
    })
    .refine((value) => {
      return typeof value === 'number' && value >= 0.01;
    }, { message: "Total cost must be greater than 0." }),

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
});

export default function PurchasesFormView() {

  const navigate = useNavigate();

  const { id: supplier_id } = useParams();

  const dispatch = useDispatch();

  const item: AddPurchaseItemPayloadType = {
    item_category_id: "",
    item_id: "",
    item_name: "",
    unit_of_measure: "",
    total_cost: "",
    quantity: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_category_id: item?.item_category_id.toString() || "",
      item_id: item?.item_id.toString() || "",
      total_cost: item?.total_cost || "",
      quantity: item?.quantity || "",
    },
  });

  const { data: cates, isFetching: isCateFetching } = api.inventory.getItemCategories.useQuery();

  const itemCategoryId = useWatch({
    control: form.control,
    name: "item_category_id", // Field to watch
  });

  const purchase_note = useRef<string>();

  const unit = useWatch({
    control: form.control,
    name: "item_id"
  })
  const unitOnly = unit ? unit.split(',')[2]?.trim() : '';

  const { data: items, isFetching: isItemFetching } = api.purchaseItem.getItems.useQuery(itemCategoryId);

  const [purchases, SetPurchases] = useState<AddPurchaseItemPayloadType[]>([]);

  const [showConverter, setShowConverter] = useState<boolean>(false);

  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    try {
      const [id, name, unit] = (item.item_id as string).split(',');
      const newPurchaseItem: AddPurchaseItemPayloadType = {
        item_id: id.trim(), // or parseInt(id.trim()) if id is numeric
        item_name: name.trim(),
        unit_of_measure: unit.trim(),
        item_category_id: item.item_category_id,
        total_cost: item.total_cost,
        quantity: item.quantity,
      };
      SetPurchases((prevPurchases: AddPurchaseItemPayloadType[]) => {
        const existingItemIndex = prevPurchases.findIndex((p) => p.item_id === newPurchaseItem.item_id);

        if (existingItemIndex !== -1) {
          // Item exists, show toast
          toast({
            title: "Item already exist in list.",
            variant: "destructive",
          });
          return prevPurchases;
        }

        // Item does not exist, add as a new purchase
        return [...prevPurchases, newPurchaseItem];
      });
      form.reset({
        item_category_id: "",
        item_id: "",
        total_cost: "",
        quantity: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const removeItem = (purchase: AddPurchaseItemPayloadType) => {
    SetPurchases((prevPurchases: AddPurchaseItemPayloadType[]) =>
      prevPurchases.filter((item) => item.item_id !== purchase.item_id)
    );
  };

  useEffect(() => {
    if (itemCategoryId) {
      form.setValue("item_id", ""); // Reset item_id to empty
    }
  }, [itemCategoryId, form]);

  useEffect(() => {
  }, [purchases]);

  const { mutate: requestPurchase } =
    api.purchaseItem.requestPurchase.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      }, onSuccess: () => {
        toast({
          title: "New Purchase Transaction added successfully",
          variant: "success",
        });
        navigate("/supplier-management/purchasehistories");
      },
      onError: (error) => {
        //form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const confirmPurchase = () => {
    const payload: ConfirmPurchaseItemsPayloadType = {
      purchase_items: purchases,
      supplier_id: Number(supplier_id),
      total_amount: Number(purchases.reduce((total, purchase) => total + purchase.total_cost, 0).toFixed(2)),
      purchase_note: purchase_note.current,
    }
    requestPurchase(payload);
  }

  const cancelPurchase = () => {
    SetPurchases([]);
  }

  return (
    <section className="m-4">
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
        {t("title.purchasing-transactions")}
      </div>
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/supplier-management/purchasehistories/supplierlist'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            Purchsing Item List
          </div>
          <div className='ms-auto'>
            <button onClick={() => setShowConverter(true)}>
              <PencilRuler className='w-6 h-6 text-secondary hover:text-blue-500' />
            </button>
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
                              <SelectItem key={item.id} value={`${item.id.toString()},${item.name},${item.unit_of_measure}`}>{item.name}</SelectItem>
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
            <div className='grid grid-cols-7 gap-6 mt-5'>
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
              {/* Total Cost */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="total_cost"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Total Cost ($) <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* button */}
              <div>
                <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-5">
                  Submit
                </button>
              </div>
            </div>
            <div>
            </div>
          </form>
        </Form>

        <div className="flex justify-center mt-6 p-4">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-100 text-sm">
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-10 text-center">#</TableHead>
                <TableHead className="text-left">Item Name</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Total ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <TableRow key={purchase.item_id} className="text-sm border-b">
                    <TableCell className="w-10 text-center">
                      <button
                        onClick={() => removeItem(purchase)}
                        className="bg-red-500 hover:bg-red-600 transition-all rounded-full p-1 text-white"
                      >
                        <Cross2Icon className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{purchase.item_name}</TableCell>
                    <TableCell className="text-center">
                      {purchase.quantity} {purchase.unit_of_measure}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${purchase.total_cost.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-gray-500">
                    No items added.
                  </TableCell>
                </TableRow>
              )}

              {purchases.length > 0 && (
                <>
                  <TableRow className="font-medium bg-gray-50">
                    <TableCell colSpan={3} className="text-right pr-2">
                      Total Amount:
                    </TableCell>
                    <TableCell colSpan={2} className="text-right font-bold">
                      ${purchases.reduce((total, purchase) => total + purchase.total_cost, 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {/* Adding Notes */}
                  <TableRow className="font-medium bg-gray-50">
                    <TableCell colSpan={5} className="text-center pr-2">
                      <input
                        type="text"
                        placeholder="Add note"
                        className="w-full border rounded-md px-2 py-1"
                        onChange={(e) => (purchase_note.current = e.target.value)} // Updating ref
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableCell colSpan={5} className="text-right space-x-2 pt-3">
                      <button
                        onClick={cancelPurchase}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmPurchase}
                        className="bg-secondary hover:bg-blue-800 text-white py-1 px-4 rounded transition-all text-sm"
                      >
                        Confirm
                      </button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>

        <UnitConverter showConverter={showConverter} setShowConverter={setShowConverter} />

      </div>
    </section >
  )
}
