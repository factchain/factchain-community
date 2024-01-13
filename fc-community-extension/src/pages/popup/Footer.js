import ProfileIcon from '@/icons/ProfileIcon';
import RatingsIcon from '@/icons/RatingsIcon';
import NotesIcon from '@/icons/NotesIcon';

function FCFooter(props) {
  function FCFooterTab(props) {
    const { name, Icon, isSelected, onClick } = props;
    const borderClass =
      'border-r-2 border-gray-800 border-opacity-20  last:border-none';

    const getContainerClasses = () => [
      'group',
      'flex flex-1 justify-center py-2',
      'text-white',
      'border-r-2 border-gray-800 border-opacity-20  last:border-none',
      props.isDisabled()
        ? 'pointer-events-none cursor-not-allowed opacity-20'
        : 'cursor-pointer',
      isSelected() ? 'bg-gray-800 bg-opacity-20' : '',
      'hover:bg-gray-800 hover:bg-opacity-20',
      'colors-animation',
      'border-r-2 border-gray-000 border-opacity-20  last:border-none',
    ];

    const getClasses = () => [
      'w-[48px] h-[48px] flex items-center justify-center',
      'colors-animation',
      'rounded-[50%]',
      isSelected() ? 'bg-cyan-600' : 'group-hover:bg-cyan-600',
    ];

    return (
      <div
        className={getContainerClasses().join(' ')}
        onclick={onClick}
        title={name}
      >
        <div className={getClasses().join(' ')}>
          <Icon size={16} />
        </div>
      </div>
    );
  }
  const { setSelectedTab } = props;

  return (
    <div className="flex bg-gray-700">
      <FCFooterTab
        name="Profile"
        Icon={ProfileIcon}
        isSelected={() => props.selectedTab() === 'Profile'}
        isDisabled={() => false}
        onClick={() => setSelectedTab('Profile')}
      />
      <FCFooterTab
        Icon={NotesIcon}
        isDisabled={() => !props.isLoggedIn()}
        isSelected={() => props.selectedTab() === 'Notes'}
        name="Notes"
        onClick={() => setSelectedTab('Notes')}
      />
      <FCFooterTab
        Icon={RatingsIcon}
        isDisabled={() => !props.isLoggedIn()}
        isSelected={() => props.selectedTab() === 'Ratings'}
        name="Ratings"
        onClick={() => setSelectedTab('Ratings')}
      />
    </div>
  );
}

export default FCFooter;
