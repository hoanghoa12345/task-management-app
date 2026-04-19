"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCardModal from "@/hooks/use-card-modal";
import CardModalHeader from "./header";
import CardModalDescription from "./description";
import CardModalActions from "./actions";
import CardModalActivity from "./activity";
import { useEffect, useState } from "react";
import { List } from "@/db/types";

export type CardWithList = {
  id: string;
  title: string;
  listId: string;
  description: string;
  list: List;
};

const CardModal = () => {
  const { isOpen, onClose, id } = useCardModal();
  const [cardData, setCardData] = useState<CardWithList | null>(null);
  const [auditLogsData, setAuditLogsData] = useState<any | null>(null);

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };

  const getCardData = async (id: string) => {
    try {
      setCardData(null);
      const data = await fetcher(`/api/cards/${id}`);
      setCardData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getAuditLogsData = async (id: string) => {
    try {
      setAuditLogsData(null);
      const data = await fetcher(`/api/cards/${id}/logs`);
      setAuditLogsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    getCardData(id);
    getAuditLogsData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
