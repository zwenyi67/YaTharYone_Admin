import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { t } from 'i18next';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';
import { useDispatch } from 'react-redux';
import { AddTablePayloadType, UpdateTablePayloadType } from '@/api/table/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const formSchema = z.object({
  table_no: z.string().min(2, {
    message: "Table Number must be at least 2 characters.",
  }),
  capacity: z.union([
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
    }, { message: "Capacity must be greater than 0." }),
    status: z.string().min(2, {
      message: "Status must be at least 2 characters.",
    }),
  createby: z.number().optional(), // Assuming this is optional for the form
});

export default function TableFormView() {

  const navigate = useNavigate();

  const location = useLocation();
  const { id } = useParams();

  const dispatch = useDispatch();

  const passedData = location.state?.data;

  const table: AddTablePayloadType = id
    ? { ...passedData }
    : {
      name: "",
      capacity: "",
      status: "",
      createby: 1,
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      table_no: table?.table_no || "",
      capacity: table?.capacity || "",
      status: table?.status || "",
      createby: table?.createby || 1,
    },
  });

  const { mutate: addTable } =
    api.table.addTable.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "New Table added successfully",
          variant: "success",
        });
        navigate("/table-management");
      },
      onError: (error) => {
        form.setError("table_no", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const { mutate: updateTable } =
    api.table.updateTable.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      }, onSuccess: () => {
        toast({
          title: "Table updated successfully",
          variant: "success",
        });
        navigate("/table-management");
      },
      onError: (error) => {
        form.setError("table_no", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });


  const onSubmit = async (table: z.infer<typeof formSchema>) => {
    try {
      // Format dates and create FormData
      const formData = new FormData();
      formData.append("table_no", table.table_no);
      formData.append("capacity", table.capacity.toString());
      formData.append("status", table.status);
  
      if (id) {
        // For edit form
        formData.append("updateby", (table.createby || 1).toString());
        formData.append("id", id);

        // Call update API
        await updateTable(formData as unknown as UpdateTablePayloadType);
      } else {
        // For add form
        formData.append("createby", (table.createby || 1).toString());

        // Call add API
        await addTable(formData as unknown as AddTablePayloadType);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="m-4">
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
        {t("title.table-management")}
      </div>
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/table-management'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            {id ? "Edit Table" : "Add New Table"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-6 mt-5'>
              {/* Full Name */}
              <FormField
                control={form.control}
                name="table_no"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Table Number <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Table Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Capacity <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input type='number'
                      placeholder="Capacity" {...field} onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Status */}
              <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Status<span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select Category'/>
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value='available'>Available</SelectItem>
                              <SelectItem value='occupied'>Occupied</SelectItem>
                              <SelectItem value='reservation'>Reservation</SelectItem>
                              <SelectItem value='outofservice'>Out of Service</SelectItem>
                          </SelectContent>
                        </Select>
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
