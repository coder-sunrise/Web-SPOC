import Draft from './Draft'
import New from './New'
import Submitted from './Submitted'
import Approved from './Approved'
import Rejected from './Rejected'

const addContent = (type, claimSubmissionActionProps) => {
  const {
    handleContextMenuItemClick,
    handleSubmitClaimStatus,
  } = claimSubmissionActionProps
  switch (type) {
    case 1:
      return <Draft handleContextMenuItemClick={handleContextMenuItemClick} />
    case 2:
      return (
        <New
          handleSubmitClaimStatus={handleSubmitClaimStatus}
          handleContextMenuItemClick={handleContextMenuItemClick}
        />
      )
    case 3:
      return (
        <Submitted handleContextMenuItemClick={handleContextMenuItemClick} />
      )
    case 4:
      return (
        <Approved handleContextMenuItemClick={handleContextMenuItemClick} />
      )
    case 5:
      return (
        <Rejected handleContextMenuItemClick={handleContextMenuItemClick} />
      )
    default:
      return (
        <New
          handleSubmitClaimStatus={handleSubmitClaimStatus}
          handleContextMenuItemClick={handleContextMenuItemClick}
        />
      )
  }
}

export const ClaimSubmissionChasTabOption = (claimSubmissionActionProps) => [
  {
    id: 1,
    name: 'Draft',
    content: addContent(1, claimSubmissionActionProps),
  },
  {
    id: 2,
    name: 'New',
    content: addContent(2, claimSubmissionActionProps),
  },
  {
    id: 3,
    name: 'Submitted',
    content: addContent(3, claimSubmissionActionProps),
  },
  {
    id: 4,
    name: 'Approved',
    content: addContent(4, claimSubmissionActionProps),
  },
  {
    id: 5,
    name: 'Rejected',
    content: addContent(5, claimSubmissionActionProps),
  },
]
