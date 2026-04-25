"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCardModal from "@/hooks/use-card-modal";
import CardModalHeader from "./header";
import CardModalDescription from "./description";
import CardModalActions from "./actions";
import CardModalActivity from "./activity";
import { List } from "@/db/types";

import { useQuery } from "@/hooks/use-query";

export type CardWithList = {
  id: string;
  title: string;
  listId: string;
  description: string;
  list: List;
};

const CardModal = () => {
  const { isOpen, onClose, id } = useCardModal();

  const { data: cardData } = useQuery<CardWithList>(
    id ? `/api/cards/${id}` : null
  );

  const { data: auditLogsData } = useQuery<any>(
    id ? `/api/cards/${id}/logs` : null
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="outline-none">
        {cardData ? (
          <CardModalHeader data={cardData} />
        ) : (
          <CardModalHeader.Skeleton />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {cardData ? (
                <CardModalDescription data={cardData} />
              ) : (
                <CardModalDescription.Skeleton />
              )}
              {auditLogsData ? (
                <CardModalActivity items={auditLogsData} />
              ) : (
                <CardModalActivity.Skeleton />
              )}
            </div>
          </div>
          {cardData ? (
            <CardModalActions data={cardData} />
          ) : (
            <CardModalActions.Skeleton />
          )}
          {}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
