"use client";

import * as React from "react";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/services.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { serviceSchema } from "@/validation";
import { toast } from "@/components/ui/toast";
import { Service } from "@/types";
import { Plus, Edit2, Trash2, Clock, Wrench } from "lucide-react";

export default function AdminServicesPage() {
  const { data: servicesData, isLoading, refetch } = useServices();
  const { mutate: createService, isPending: creating } = useCreateService();
  const { mutate: updateService, isPending: updating } = useUpdateService();
  const { mutate: deleteService, isPending: deleting } = useDeleteService();

  const services = servicesData?.data || [];

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);

  // Form Fields
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("HVAC");
  const [basePrice, setBasePrice] = React.useState<number>(100);
  const [estimatedDurationHours, setEstimatedDurationHours] = React.useState<number>(2);
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const openCreateModal = () => {
    setEditingService(null);
    setName("");
    setDescription("");
    setCategory("HVAC");
    setBasePrice(120);
    setEstimatedDurationHours(2);
    setIsAvailable(true);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setCategory(service.category);
    setBasePrice(service.basePrice);
    setEstimatedDurationHours(service.estimatedDurationHours);
    setIsAvailable(service.isAvailable);
    setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      category,
      basePrice: Number(basePrice),
      estimatedDurationHours: Number(estimatedDurationHours),
      isAvailable,
    };

    const validation = serviceSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (editingService) {
      updateService(
        { id: editingService.id, payload },
        {
          onSuccess: () => {
            toast.success("Service catalog offering updated");
            setModalOpen(false);
            refetch();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to update service");
          },
        }
      );
    } else {
      createService(payload, {
        onSuccess: () => {
          toast.success("New service added to public catalog");
          setModalOpen(false);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create service");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to deactivate and remove this service?")) {
      deleteService(id, {
        onSuccess: () => {
          toast.success("Service removed from catalog");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete service");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Service Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure offered trade specialties, base diagnostic rates, and typical duration.
          </p>
        </div>
        <Button onClick={openCreateModal} size="sm" className="gap-2">
          <Plus className="size-4" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Typical Duration</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/60 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : services.length > 0 ? (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground">{service.name}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                          {service.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-xs text-foreground">
                      {formatCurrency(service.basePrice)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        <span>{service.estimatedDurationHours} hours</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          service.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {service.isAvailable ? "Active" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditModal(service)}
                          title="Edit Service"
                        >
                          <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(service.id)}
                          title="Delete Service"
                        >
                          <Trash2 className="size-3.5 text-destructive hover:opacity-80" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No services in catalog. Click &ldquo;Add Service&rdquo; above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service Offering" : "Add New Catalog Service"}
            </DialogTitle>
            <DialogDescription>
              Provide catalog specifications for pricing and automated scheduling estimates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="sName">Service Title</FieldLabel>
                <Input
                  id="sName"
                  placeholder="e.g. Tankless Water Heater Inspection"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FieldError error={errors.name} />
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="sDesc">Detailed Description</FieldLabel>
                <Textarea
                  id="sDesc"
                  placeholder="Scope of work covered, preliminary inspection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <FieldError error={errors.description} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="sCategory">Trade Category</FieldLabel>
                  <select
                    id="sCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </Field>

                <Field data-invalid={!!errors.basePrice}>
                  <FieldLabel htmlFor="sPrice">Base Price ($ USD)</FieldLabel>
                  <Input
                    id="sPrice"
                    type="number"
                    step="0.01"
                    min="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  />
                  <FieldError error={errors.basePrice} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.estimatedDurationHours}>
                  <FieldLabel htmlFor="sDuration">Est. Hours</FieldLabel>
                  <Input
                    id="sDuration"
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={estimatedDurationHours}
                    onChange={(e) => setEstimatedDurationHours(parseFloat(e.target.value) || 1)}
                  />
                  <FieldError error={errors.estimatedDurationHours} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="sAvail">Availability</FieldLabel>
                  <select
                    id="sAvail"
                    value={isAvailable ? "true" : "false"}
                    onChange={(e) => setIsAvailable(e.target.value === "true")}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="true">Active & Bookable</option>
                    <option value="false">Disabled / Paused</option>
                  </select>
                </Field>
              </div>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={creating || updating}>
                {editingService ? "Save Changes" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
