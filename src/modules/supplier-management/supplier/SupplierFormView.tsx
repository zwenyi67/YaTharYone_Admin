import { AddEmployeePayloadType, GetRolesType, UpdateEmployeePayloadType } from '@/api/employee/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { format } from "date-fns";
import DatePicker from '@/components/ui/datepicker';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';


const formSchema = z.object({
  employee_id: z.string().nonempty({
    message: "Employee Id is required.",
  }),
  fullname: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  profile: z
    .instanceof(File, {
      message: "Profile photo is required and must be an image file.",
    })
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      {
        message: "Only PNG, JPG, or JPEG files are allowed.",
      }
    ), // Validate as an instance of File
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Must be a valid email address.",
  }),
  gender: z.string().nonempty({
    message: "Gender must be Male, Female, or Other.",
  }),
  birth_date: z.date({
    required_error: "Birth date is required.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  date_hired: z.date({
    required_error: "Hired date is required.",
  }),
  role_id: z.number({
    required_error: "Role ID is required.",
  }),
  createby: z.number().optional(), // Assuming this is optional for the form
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SupplierFormView() {

  const { data, isFetching } = api.employee.getRoles.useQuery();
  const navigate = useNavigate();


  const location = useLocation();
  const { id } = useParams();

  const passedData = location.state?.data;

  const emp: AddEmployeePayloadType = id
    ? { ...passedData }
    : {
      employee_id: "",
      fullname: "",
      profile: undefined,
      phone: "",
      email: "",
      gender: "male",
      birth_date: null,
      address: "",
      date_hired: null,
      role_id: 1,
      createby: 1,
      username: "",
      password: "",
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: emp?.employee_id || "",
      fullname: emp?.fullname || "",
      profile: emp?.profile,
      phone: emp?.phone || "",
      email: emp?.email || "",
      gender: emp?.gender || "",
      birth_date: emp?.birth_date ? new Date(emp.birth_date) : undefined,
      address: emp?.address || "",
      date_hired: emp?.date_hired ? new Date(emp.date_hired) : undefined,
      role_id: emp?.role_id || 1,
      createby: emp?.createby || 1,
      username: emp?.username || "",
      password: emp?.password || "",
    },
  });

  const { mutate: addEmployee } =
    api.employee.addEmployee.useMutation({
      onSuccess: () => {
        toast({
          title: "New Employee added successfully",
          variant: "success",
        });
        navigate("/employees");
      },
      onError: (error) => {
        console.error("Error adding Employee process: ", error);
        form.setError("fullname", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: updateEmployee } =
    api.employee.updateEmployee.useMutation({
      onSuccess: () => {
        toast({
          title: "Employee updated successfully",
          variant: "success",
        });
        navigate("/employees");
      },
      onError: (error) => {
        console.error("Error updating Employee process: ", error);
        form.setError("fullname", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });


  const onSubmit = async (emp: z.infer<typeof formSchema>) => {
    try {
      // Format dates and create FormData
      const formData = new FormData();
      formData.append("employee_id", emp.employee_id);
      formData.append("fullname", emp.fullname);

      // Handle profile based on whether it's a file or an existing URL
      const profile = form.getValues("profile");
      if (profile instanceof File) {
        formData.append("profile", profile); // Append the new file
      } else if (id && emp.profile) {
        formData.append("profile", emp.profile); // Append the existing profile URL
      }

      formData.append("phone", emp.phone);
      formData.append("email", emp.email);
      formData.append("gender", emp.gender);
      formData.append("birth_date", format(emp.birth_date, "yyyy-MM-dd"));
      formData.append("address", emp.address);
      formData.append("date_hired", format(emp.date_hired, "yyyy-MM-dd"));
      formData.append("role_id", emp.role_id.toString());
      formData.append("username", emp.username);
      formData.append("password", emp.password);

      if (id) {
        // For edit form
        formData.append("updateby", (emp.createby || 1).toString());
        formData.append("id", id);

        // Call update API
        await updateEmployee(formData as unknown as UpdateEmployeePayloadType);
      } else {
        // For add form
        formData.append("createby", (emp.createby || 1).toString());

        // Call add API
        await addEmployee(formData as unknown as AddEmployeePayloadType);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };




  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (id && emp.profile) {
      const fileUrl = "http://127.0.0.1:8000" + emp.profile;
      setPreview(fileUrl); // Set the preview to the existing profile URL
      //form.setValue("profile", null); // Do not set the profile as a File yet
    }
  }, [id, emp.profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only PNG, JPG, or JPEG files are allowed.");
        setPreview(preview); // Keep the existing preview
        return;
      }

      setFileError(null);
      form.setValue("profile", file); // Set the file in the form state
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string); // Show preview as base64 URL
      reader.readAsDataURL(file);
    }
  };



  return (
    <section className="m-4">
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/supplier-management/suppliers'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500'/>
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            {id ? "Edit Supplier" : "Add New Supplier"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="profilePhoto"
                className="flex h-48 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                style={{
                  backgroundImage: preview ? `url(${preview})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!preview && <span className="text-center">Click to upload Profile</span>}
              </label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            </div>
            <div className='grid grid-cols-2 gap-6 mt-5'>
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier ID <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Supplier ID" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Full Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {/* BirthDate */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Birth Date <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Birth Date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Address */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Address <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Phone */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* HiredDate */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="date_hired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hired Date <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Hired Date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Role */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={isFetching}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-[5.5px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <option value="" disabled>
                            {isFetching ? "Loading roles..." : "Select a role"}
                          </option>
                          {data?.map((role: GetRolesType) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <div className='h-4'>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-5">
                Submit
              </button>
            </div>
          </form>
        </Form>
      </div>
    </section >
  )
}