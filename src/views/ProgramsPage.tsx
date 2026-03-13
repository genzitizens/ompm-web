import { FormEvent, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { createBillHistory } from "../bills/billsApi";
import type { BillHistoryResponse, CreateBillHistoryRequest } from "../bills/types";
import { SectionCard } from "../ui/SectionCard";

type DetailInput = {
  amount: string;
};

type PayeeInput = {
  payeeName: string;
  payeeMobileNo: string;
  payeeTelegramChatId: string;
  amount: string;
};

type ImageInput = {
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: string;
};

const initialImageState: ImageInput = {
  fileName: "",
  storageKey: "",
  mimeType: "",
  fileSizeBytes: ""
};

function createBillCode() {
  return crypto.randomUUID();
}

export function ProgramsPage() {
  const { session } = useAuth();
  const [billCode, setBillCode] = useState(createBillCode);
  const [details, setDetails] = useState<DetailInput[]>([{ amount: "" }]);
  const [payees, setPayees] = useState<PayeeInput[]>([
    { payeeName: "", payeeMobileNo: "", payeeTelegramChatId: "", amount: "" }
  ]);
  const [image, setImage] = useState<ImageInput>(initialImageState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdBill, setCreatedBill] = useState<BillHistoryResponse | null>(null);

  const detailTotalCents = details.reduce((total, detail) => total + toCents(detail.amount), 0);
  const payeeTotalCents = payees.reduce((total, payee) => total + toCents(payee.amount), 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload: CreateBillHistoryRequest = {
        accountId: session!.account.id,
        billCode,
        totalAmountCents: detailTotalCents,
        details: details.map((detail) => ({
          amountCents: toRequiredCents(detail.amount, "Each detail amount is required")
        })),
        payees: payees.map((payee) => ({
          payeeName: payee.payeeName.trim(),
          payeeMobileNo: payee.payeeMobileNo.trim() || undefined,
          payeeTelegramChatId: payee.payeeTelegramChatId.trim() || undefined,
          amountCents: toRequiredCents(payee.amount, "Each payee amount is required")
        }))
      };

      if (!payload.billCode.trim()) {
        throw new Error("Bill code is required");
      }

      if (payload.payees.some((payee) => !payee.payeeName)) {
        throw new Error("Each payee must have a name");
      }

      if (payload.totalAmountCents <= 0) {
        throw new Error("Bill total must be greater than zero");
      }

      if (payload.totalAmountCents !== payeeTotalCents) {
        throw new Error("Participant split must match the bill total");
      }

      if (hasImageMetadata(image)) {
        payload.image = {
          fileName: image.fileName.trim(),
          storageKey: image.storageKey.trim(),
          mimeType: image.mimeType.trim(),
          fileSizeBytes: toRequiredInteger(image.fileSizeBytes, "Image file size must be a whole number")
        };
      }

      const response = await createBillHistory(payload, session?.token);
      setCreatedBill(response);
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create bill split");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setBillCode(createBillCode());
    setDetails([{ amount: "" }]);
    setPayees([{ payeeName: "", payeeMobileNo: "", payeeTelegramChatId: "", amount: "" }]);
    setImage(initialImageState);
  }

  function updateDetail(index: number, amount: string) {
    setDetails((current) => current.map((detail, currentIndex) => (currentIndex === index ? { amount } : detail)));
  }

  function updatePayee(index: number, field: keyof PayeeInput, value: string) {
    setPayees((current) =>
      current.map((payee, currentIndex) => (currentIndex === index ? { ...payee, [field]: value } : payee))
    );
  }

  return (
    <div className="stack">
      <SectionCard
        title="Create a bill split"
        description="Submit bill details and participants for the logged-in account. The backend stores the bill, itemized amounts, and payees."
      >
        <form className="bill-form" onSubmit={handleSubmit}>
          <div className="bill-form__grid">
            <label className="field">
              <span>Bill code</span>
              <input type="text" value={billCode} readOnly required />
            </label>

            <div className="summary-strip">
              <div>
                <span>Logged-in account</span>
                <strong>{session?.account.displayName}</strong>
              </div>
              <div>
                <span>Detail total</span>
                <strong>{formatCurrency(detailTotalCents)}</strong>
              </div>
              <div>
                <span>Participant total</span>
                <strong>{formatCurrency(payeeTotalCents)}</strong>
              </div>
            </div>
          </div>

          <div className="bill-section">
            <div className="section-headline">
              <div>
                <h3>Itemized details</h3>
                <p>These values become `details[]` in the backend request.</p>
              </div>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setDetails((current) => [...current, { amount: "" }])}
              >
                Add detail
              </button>
            </div>
            <div className="input-list">
              {details.map((detail, index) => (
                <div key={`detail-${index}`} className="inline-form-card">
                  <label className="field">
                    <span>Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detail.amount}
                      onChange={(event) => updateDetail(index, event.target.value)}
                      required
                    />
                  </label>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() =>
                      setDetails((current) => (current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : current))
                    }
                    disabled={details.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bill-section">
            <div className="section-headline">
              <div>
                <h3>Participants</h3>
                <p>These values become `payees[]` in the backend request.</p>
              </div>
            </div>
            <div className="input-list">
              {payees.map((payee, index) => (
                <div key={`payee-${index}`} className="payee-row">
                  <div className="payee-grid inline-form-card">
                    <label className="field">
                      <span>Name</span>
                      <input
                        type="text"
                        value={payee.payeeName}
                        onChange={(event) => updatePayee(index, "payeeName", event.target.value)}
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Mobile No.</span>
                      <input
                        type="text"
                        value={payee.payeeMobileNo}
                        onChange={(event) => updatePayee(index, "payeeMobileNo", event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Telegram Chat ID</span>
                      <input
                        type="text"
                        value={payee.payeeTelegramChatId}
                        onChange={(event) => updatePayee(index, "payeeTelegramChatId", event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Amount</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={payee.amount}
                        onChange={(event) => updatePayee(index, "amount", event.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="button button--secondary payee-row__remove"
                    onClick={() =>
                      setPayees((current) => (current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : current))
                    }
                    disabled={payees.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                setPayees((current) => [
                  ...current,
                  { payeeName: "", payeeMobileNo: "", payeeTelegramChatId: "", amount: "" }
                ])
              }
            >
              Add participant
            </button>
          </div>

          <div className="bill-section">
            <div className="section-headline">
              <div>
                <h3>Image metadata</h3>
                <p>Optional metadata block matching the current backend contract.</p>
              </div>
            </div>
            <div className="image-grid">
              <label className="field">
                <span>File name</span>
                <input
                  type="text"
                  value={image.fileName}
                  onChange={(event) => setImage((current) => ({ ...current, fileName: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Storage key</span>
                <input
                  type="text"
                  value={image.storageKey}
                  onChange={(event) => setImage((current) => ({ ...current, storageKey: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>MIME type</span>
                <input
                  type="text"
                  value={image.mimeType}
                  onChange={(event) => setImage((current) => ({ ...current, mimeType: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>File size bytes</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={image.fileSizeBytes}
                  onChange={(event) => setImage((current) => ({ ...current, fileSizeBytes: event.target.value }))}
                />
              </label>
            </div>
          </div>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving bill..." : "Create bill split"}
          </button>
        </form>
      </SectionCard>

      <SectionCard
        title="Latest saved bill"
        description="Backend response echoed back after a successful create request."
      >
        {createdBill ? (
          <div className="saved-bill">
            <div className="summary-strip">
              <div>
                <span>Bill ID</span>
                <strong>{createdBill.id}</strong>
              </div>
              <div>
                <span>Bill code</span>
                <strong>{createdBill.billCode}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatCurrency(createdBill.totalAmountCents)}</strong>
              </div>
            </div>
            <div className="saved-bill__grid">
              <article className="program-card">
                <div className="program-card__topline">
                  <h3>Participants stored</h3>
                  <span>{createdBill.payees.length}</span>
                </div>
                <ul className="checklist">
                  {createdBill.payees.map((payee) => (
                    <li key={payee.id}>
                      {payee.payeeName}: {formatCurrency(payee.amountCents)}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="program-card">
                <div className="program-card__topline">
                  <h3>Details stored</h3>
                  <span>{createdBill.details.length}</span>
                </div>
                <ul className="checklist">
                  {createdBill.details.map((detail) => (
                    <li key={detail.id}>{formatCurrency(detail.amountCents)}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        ) : (
          <p className="empty-state">No bill has been created in this session yet.</p>
        )}
      </SectionCard>
    </div>
  );
}

function toCents(value: string) {
  const parsedValue = Number.parseFloat(value);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return 0;
  }

  return Math.round(parsedValue * 100);
}

function toRequiredCents(value: string, message: string) {
  const cents = toCents(value);

  if (cents <= 0) {
    throw new Error(message);
  }

  return cents;
}

function toRequiredInteger(value: string, message: string) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    throw new Error(message);
  }

  return parsedValue;
}

function hasImageMetadata(image: ImageInput) {
  return Boolean(image.fileName || image.storageKey || image.mimeType || image.fileSizeBytes);
}

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amountCents / 100);
}
